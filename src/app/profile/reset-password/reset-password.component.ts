import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { BehaviorSubject, defer, firstValueFrom, OperatorFunction } from 'rxjs';
import { catchError, finalize, mapTo } from 'rxjs/operators';
import { HeaderProgressBar } from 'src/app/global-header/global-header.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  emailControl: FormControl<string>;
  form: FormGroup<{ email: FormControl<string> }>;
  showLoadingBar$ = new BehaviorSubject(false);
  @ViewChild(HeaderProgressBar)
  headerProgressBar: HeaderProgressBar | undefined;
  private actionSheet?: HTMLIonActionSheetElement;
  private actionSheetOngoing?: Promise<unknown>;
  private location = inject(Location);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  constructor(private authService: AuthService, private actionSheetCtrl: ActionSheetController) {
    this.emailControl = new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true });
    this.form = new FormGroup({
      email: this.emailControl,
    });
  }

  ionViewDidEnter() {
    const navState = this.location.getState() as {email: string} | null;
    if (navState?.email) {
      this.emailControl.setValue(navState.email);
    }
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.showLoadingBar$.complete();
  }

  resetPassword() {
    if (this.emailControl.invalid || this.actionSheetOngoing) {
      return;
    }

    return this.actionSheetOngoing = this.actionSheetCtrl
      .create({
        header: "Tu vas être déconnecté, assure-toi d'avoir accès à ta messagerie",
        buttons: [
          {
            text: 'OK',
            handler: () =>
              firstValueFrom(
                defer(() => {
                  this.showLoadingBar$.next(true);
                  this.headerProgressBar?.toggleIndeterminate(true);
                  return this.authService.resetPassword({ email: this.emailControl.value }).pipe(
                    mapTo(true),
                    showToastOnError.call(this),
                    finalize(() => this.headerProgressBar?.toggleIndeterminate(false))
                  );

                  function showToastOnError(this: ResetPasswordComponent): OperatorFunction<boolean, boolean> {
                    return catchError(async () => {
                      const toast = await this.toastCtrl.create({
                        message: "Une erreur est survenue ou aucun compte ne correspond à l'email renseignée.",
                        color: 'danger',
                        duration: 3000,
                      });
                      await this.actionSheet?.dismiss('error', 'cancel');
                      await toast.present();
                      return false;
                    });
                  }
                })
              ),
            role: 'destructive',
          },
          {
            text: 'Annuler',
            role: 'cancel',
          },
        ],
      })
      .then((_actionSheet) => {
        this.actionSheet = _actionSheet;
        void this.actionSheet.present();
        return _actionSheet.onDidDismiss();
      })
      .then((event) => {
        if (event.role === 'destructive') {
          return this.authService.logOut(false).then(() => this.router.navigateByUrl('/login', {state: { email: this.emailControl.value }}));
        }
        return;
      })
      .finally(() => {
        this.actionSheet = undefined;
        this.actionSheetOngoing = undefined;
      });
  }
}
