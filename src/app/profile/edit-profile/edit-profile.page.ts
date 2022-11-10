import { Location } from '@angular/common';
import { Component, HostBinding, NgZone } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { differenceInHours, intervalToDuration, parse } from 'date-fns/esm';
import { fr } from 'date-fns/esm/locale';
import { combineLatest, EMPTY, from, interval, Observable, of, Subscription } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { sameValidator } from 'src/app/forms/validators';
import { AuthService } from '../auth.service';
import { EditProfileBodyRequest } from '../profile.model';
import { ProfileService } from '../profile.service';

interface ProfileEditionForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  entityName: FormControl<string>;
  email: FormControl<string>;
  passwordCurrent: FormControl<string>;
  changePassword: FormGroup<{
    passwordNew: FormControl<string>;
    passwordNewConfirmation: FormControl<string>;
  }>;
}

@Component({
  selector: 'mystk-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {
  readonly canCancel$: Observable<boolean>;
  private subs: Subscription[] = [];
  editForm: FormGroup<ProfileEditionForm>;
  @HostBinding('class.temporary-password')
  get isShowingCountdown() {
    return !!this.toast;
  }
  toast: HTMLIonToastElement;
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

  ionViewWillEnter(): void {

    const sub = combineLatest([this.profileService.getMyProfile(), this.authService.isPasswordTemporary$()]).pipe(
      take(1),
      tap(([profile]) => {
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
      }),
      switchMap(([_, tempPassExpiration]) => {
        if (!!tempPassExpiration) {
          const passwordNewCtrl = this.editForm.get('changePassword.passwordNew') as UntypedFormControl;
          const tempPassExpirationDate = parse(tempPassExpiration, 'dd-MM-yyyy HH:mm:ss', new Date(), { locale: fr });
          passwordNewCtrl.setValidators(Validators.compose([passwordNewCtrl.validator, Validators.required]));
          passwordNewCtrl.markAsTouched();

          return from(this.toastController.create({
            message: this.computeCountdownToExpiration(tempPassExpirationDate),
            translucent: true,
            color: 'warning',
          })).pipe(
            switchMap(toastElt => {
              this.toast = toastElt;
              return toastElt.present().then(() => console.log('present'));
            }),
            switchMap(() => this.ngZone.runOutsideAngular(() => interval(1000).pipe(
              takeUntil(this.authService.isAccesTokenExpired$().pipe(
                filter(expired => expired),
                  tap(() => this.authService.logOut()),
              )),
              tap(() => this.ngZone.run(() => this.toast.message = this.computeCountdownToExpiration(tempPassExpirationDate)))
            )))
          )
        } else {
          return EMPTY;
        }
      }),
    ).subscribe();
    this.subs.push(sub);
  }

  private computeCountdownToExpiration(tempPassExpirationDate: Date) {
    const duration = intervalToDuration({ start: new Date(), end: tempPassExpirationDate });
    const diffInHours = differenceInHours(tempPassExpirationDate, new Date(), { roundingMethod: 'floor' });
    const countdown = (diffInHours ? (diffInHours + 'H') : '')
      + (duration.minutes + 'm')
      + (duration.seconds + 's');
    return `Ton mot de passe est temporaire, il te reste ${countdown} pour le changer avant qu'il n'expire.`;
  }

  ionViewWillLeave() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.toast?.dismiss();
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

  submit() {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      return;
    } else {
      const { email, passwordCurrent: oldPassword, changePassword: { passwordNew: newPassword } } = this.editForm.value;
      const body: EditProfileBodyRequest = { email, oldPassword };
      if (newPassword) {
        body.newPassword = newPassword;
      }
      this.profileService
        .editMyProfile(body)
        .pipe(
          tap({
            error: (error) => {
              this.toastController
                .create({
                  message: error.message,
                  color: 'danger',
                  duration: 3000,
                })
                .then((toast) => toast.present());
            },
          }),
          switchMap((e) =>
            newPassword
              ? this.authService
                .logOut(false)
                .then(() => this.router.navigateByUrl('/login'))
                  .then(() =>
                    this.toastController.create({
                      message:
                        'Tu peux te reconnecter avec tes nouveaux identifiants',
                      color: 'success',
                      duration: 4000,
                    })
                  )
                  .then((toast) => toast.present())
              : of(e)
          )
        )
        .subscribe(() => {
          this.toastController
            .create({
              message: 'Changements enregistrés',
              color: 'success',
              duration: 3000,
            })
            .then((toast) => toast.present());
        });
    }
  }
}
