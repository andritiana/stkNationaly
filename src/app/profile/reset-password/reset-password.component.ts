import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { BehaviorSubject, defer, firstValueFrom, OperatorFunction } from 'rxjs';
import { catchError, finalize, mapTo } from 'rxjs/operators';
import { HeaderProgressBar } from 'src/app/global-header/global-header.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  emailControl: FormControl<string>;
  form: FormGroup<{ email: FormControl<string>; }>;
  showLoadingBar$ = new BehaviorSubject(false);
  @ViewChild(HeaderProgressBar)
  headerProgressBar: HeaderProgressBar | undefined;
  private toastCtrl = inject(ToastController);
  constructor(
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
  ) {
    this.emailControl = new FormControl('', {validators: [Validators.required, Validators.email], nonNullable: true});
    this.form = new FormGroup({
      email: this.emailControl,
    });

  }

  ngOnInit(): void {
  }

  resetPassword() {
    if (this.emailControl.invalid) {
      return;
    }
    let actionSheet: HTMLIonActionSheetElement | undefined;
    this.actionSheetCtrl.create({
      header: "Tu vas être déconnecté, assure-toi d'avoir accès à ta messagerie",
      buttons: [
        {
          text: 'OK',
          handler: () => firstValueFrom(defer(() => {
            this.showLoadingBar$.next(true);
            this.headerProgressBar?.toggleIndeterminate(true);
            return this.authService.resetPassword({ email: this.emailControl.value }).pipe(
              mapTo(true),
              showToastOnError.call(this),
              finalize(() => this.headerProgressBar?.toggleIndeterminate(false)),
            );

            function showToastOnError(this: ResetPasswordComponent): OperatorFunction<boolean, boolean> {
              return catchError(async (err) => {
                const toast = await this.toastCtrl.create({
                  message: "Une erreur est survenue ou aucun compte ne correspond à l'email renseignée.",
                  color: 'danger',
                  duration: 3000,
                });
                await actionSheet?.dismiss('error', 'cancel');
                await toast.present();
                return false;
              });
            }
}
          )),
          role: 'destructive',
        },
        {
          text: 'Annuler',
          role: 'cancel',
        }
      ],
      translucent: true,
    })
      .then(_actionSheet => {
        actionSheet = _actionSheet;
        _actionSheet.present();
        return _actionSheet.onDidDismiss()
      })
      .then(event => {
        if (event.role === 'destructive') {
          this.authService.logOut();
        }
        actionSheet = undefined;
      });

  }

}
