import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { sameValidator } from 'src/app/forms/validators';
import { AuthService } from '../auth.service';
import { EditProfileBodyRequest } from '../profile.model';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'mystk-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {
  editForm: FormGroup;
  readonly canCancel$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private location: Location,
    private router: Router,
    private toastController: ToastController,
  ) {
    this.canCancel$ = this.authService.isPasswordTemporary$().pipe(map(isTemporary => !isTemporary), shareReplay({refCount: true, bufferSize: 1}));
  }

  ionViewWillEnter(): void {

    this.profileService.getMyProfile().pipe(take(1)).subscribe((profile) => {
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

    });
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
      this.profileService.editMyProfile(body).pipe(
        tap({
          error: (error) => {
            this.toastController.create({
              message: error.message,
              color: 'danger',
              duration: 3000,
            }).then(toast => toast.present());
          },
        }),
        switchMap(e => newPassword
          ? this.authService.logOut().then(() => this.toastController.create({
            message: 'Tu peux te reconnecter avec tes nouveaux identifiants',
            color: 'success',
          }))
          : of(e)),
      ).subscribe(() => {
        this.toastController.create({
          message: 'Changements enregistrés',
          color: 'success',
          duration: 3000,
        }).then(toast => toast.present());
      })
    }
  }
}
