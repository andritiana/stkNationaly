import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController } from '@ionic/angular';
import { mapTo } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  emailControl: FormControl<string>;
  form: FormGroup<{ email: FormControl<string>; }>;
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
    this.actionSheetCtrl.create({
      header: "Tu vas être déconnecté, assure-toi d'avoir accès à ta messagerie",
      buttons: [
        {
          text: 'OK',
          handler: () => this.authService.resetPassword({ email: this.emailControl.value }).pipe(mapTo(true)).toPromise(),
          role: 'destructive',
        },
        {
          text: 'Annuler',
          role: 'cancel',
        }
      ],
      translucent: true,
    })
      .then(actionSheet => {
        actionSheet.present();
        return actionSheet.onDidDismiss()
      })
      .then(event => {
        if (event.role === 'destructive') {
          this.authService.logOut();
        }
      });

  }

}
