import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

interface LoginForm {
  login: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      login: new FormControl('', {validators: [Validators.required], nonNullable: true}),
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(5)], nonNullable: true}),
    })
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { login, password } = this.loginForm.value;
    this.authService
      .logIn(login!, password!)
      .pipe(
        switchMap(() => this.router.navigate(['/profile'], { replaceUrl: true })),
        tap({
          error: (e) => {
            this.loginForm.setErrors({ response: e });
            this.toastController.create({
              color: 'danger',
              duration: 3000,
              message: "Nom d'utilisateur/e-mail et/ou mot de passe non reconnus."
            }).then(toast => toast.present());
          }
        }),
        finalize(() =>
          this.loginForm.valueChanges.pipe(take(1)).subscribe(() => {
            this.loginForm.setErrors(null);
          })
        )
      )
      .subscribe(() => this.loginForm.setErrors({}));
  }

}
