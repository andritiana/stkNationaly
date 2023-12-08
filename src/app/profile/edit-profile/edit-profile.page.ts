import { Location } from '@angular/common';
import { Component, HostBinding, NgZone } from '@angular/core';
import type { UntypedFormControl } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { differenceInHours, intervalToDuration, parse } from 'date-fns/esm';
import { fr } from 'date-fns/esm/locale';
import type { Observable, Subscription } from 'rxjs';
import { EMPTY, Subject, combineLatest, from, interval, race } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { sameValidator } from 'src/app/forms/validators';
import { AuthService } from '../auth.service';
import type { EditProfileBodyRequest, Profile } from '../profile.model';
import { ProfileService } from '../profile.service';

interface ProfileEditionForm {
  changePassword: FormGroup<{
    passwordNew: FormControl<string | null>;
    passwordNewConfirmation: FormControl<string | null>;
  }>;
  email: FormControl<string | null>;
  entityName: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  passwordCurrent: FormControl<string | null>;
}

@Component({
  selector: 'mystk-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {

  readonly canCancel$: Observable<boolean>;

  editForm?: FormGroup<ProfileEditionForm>;
  toast?: HTMLIonToastElement;

  private cancelCountdown$ = new Subject<void>();
  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private location: Location,
    private router: Router,
    private toastController: ToastController,
    private ngZone: NgZone,
  ) {
    this.canCancel$ = this.authService.isPasswordTemporary$().pipe(map(isTemporary => !isTemporary), shareReplay({refCount: true, bufferSize: 1}));
  }

  @HostBinding('class.temporary-password')
  get isShowingCountdown() {
    return !!this.toast;
  }

  cancel() {
    this.canCancel$.subscribe(canCancel => {
      if (canCancel) {
        this.location.back();
      } else {
        this.router.navigateByUrl('/');
      }
    })
  }

  ionViewWillEnter(): void {
    const sub = combineLatest([this.profileService.getMyProfile(), this.authService.isPasswordTemporary$()]).pipe(
      take(1),
      tap(([profile]) => this.initializeForm(profile)),
      switchMap(([_, tempPassExpiration]) => {
        if (!!tempPassExpiration) {
          return this.initializeCountdownToast(tempPassExpiration);
        } else {
          return EMPTY;
        }
      }),
    ).subscribe();
    this.subs.push(sub);
  }


  ionViewWillLeave() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.toast?.dismiss();
  }

  submit() {
    this.editForm?.markAllAsTouched();
    if (this.editForm?.invalid) {
      return;
    } else {
      const { email, passwordCurrent: oldPassword, changePassword: { passwordNew: newPassword } } = this.editForm?.getRawValue() ?? {changePassword: {}};
      if (!email || !oldPassword) {
        void this.toastController.create({
          message: "L'email ou l'ancien mot de passe ne peuvent être vides",
          color: 'danger',
        }).then((toastElt => {
          this.toast = toastElt;
          return toastElt.present();
        }));
        return;
      }
      const body: EditProfileBodyRequest = { email, oldPassword };
      if (newPassword) {
        body.newPassword = newPassword;
      }
      this.profileService
        .editMyProfile(body)
        .pipe(
          tap({
            /** if failed, toast an error */
            error: (error: unknown) => {
              void this.toastController
                .create({
                  message: (error instanceof Error) ? error.message : 'Une erreur est survenue. Merci de réessayer ',
                  color: 'danger',
                  duration: 3000,
                })
                .then((toast) => toast.present());
            },
          }),
          switchMap(async () => {
            if (newPassword) {
              this.cancelCountdown$.next()
              await this.authService
                .logOut(false);
              await this.router.navigateByUrl('/login', { state: { email } });
              const toast = await this.toastController.create({
                message: 'Tu peux te reconnecter avec tes nouveaux identifiants',
                color: 'success',
                duration: 4000,
              });
              return await toast.present();
            } else {
              const toast_1 = await this.toastController
                .create({
                  message: 'Changements enregistrés',
                  color: 'success',
                  duration: 3000,
                });
              return await toast_1.present();
            }
        })
        )
        .subscribe();
    }
  }

  private computeCountdownToExpiration(tempPassExpirationDate: Date) {
    const duration = intervalToDuration({ start: new Date(), end: tempPassExpirationDate });
    const diffInHours = differenceInHours(tempPassExpirationDate, new Date(), { roundingMethod: 'floor' });
    const countdown = (diffInHours ? (diffInHours + 'H') : '')
      + (duration.minutes + 'm')
      + (duration.seconds + 's');
    return `Ton mot de passe est temporaire, il te reste ${countdown} pour le changer avant qu'il n'expire.`;
  }

  private initializeCountdownToast(tempPassExpiration: string) {
    const passwordNewCtrl = this.editForm?.get('changePassword.passwordNew') as UntypedFormControl;
    const tempPassExpirationDate = parse(tempPassExpiration, 'dd-MM-yyyy HH:mm:ss', new Date(), { locale: fr });
    passwordNewCtrl.setValidators(Validators.compose([passwordNewCtrl.validator, Validators.required]));
    passwordNewCtrl.markAsTouched();

    return from(this.toastController.create({
      message: this.computeCountdownToExpiration(tempPassExpirationDate),
      color: 'warning',
    })).pipe(
      switchMap(toastElt => {
        this.toast = toastElt;
        return toastElt.present();
      }),
      switchMap(() => this.ngZone.runOutsideAngular(() => interval(1000).pipe(
        tap(() => this.ngZone.run(() => this.toast && (this.toast.message = this.computeCountdownToExpiration(tempPassExpirationDate)))),
        takeUntil(race(
          this.authService.isAccesTokenExpired$().pipe(
            filter(expired => expired),
            tap(() => void this.authService.logOut()),
          ),
          this.cancelCountdown$,
        )),
      )))
    );
  }

  private initializeForm(profile: Profile) {
    const { firstname, lastname, entityName, email } = profile;

    this.editForm = new FormGroup({
      firstName: new FormControl({ value: firstname, disabled: true }),
      lastName: new FormControl({ value: lastname, disabled: true }),
      entityName: new FormControl({ value: entityName, disabled: true }),
      email: new FormControl(email, {
        validators: [Validators.email, Validators.required],
      }),
      passwordCurrent: new FormControl('', {
        validators: [Validators.minLength(8), Validators.required],
      }),
      changePassword: new FormGroup(
        {
          passwordNew: new FormControl('', {
            validators: [Validators.minLength(8)],
          }),
          passwordNewConfirmation: new FormControl('', {
            validators: [Validators.minLength(8)],
          }),
        },
        {
          validators: [sameValidator('passwordNew', 'passwordNewConfirmation')],
        }
      ),
    });
  }
}
