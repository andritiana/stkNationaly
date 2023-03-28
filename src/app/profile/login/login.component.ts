import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { finalize, switchMap, take, tap } from 'rxjs/operators';
import { HeaderProgressBar } from 'src/app/global-header/global-header.component';
import { AuthService } from '../auth.service';

interface LoginForm {
  login: FormControl<string>;
  password: FormControl<string>;
}

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  @ViewChild(HeaderProgressBar)
  private headerProgress: HeaderProgressBar | undefined;
  processing$ = new BehaviorSubject(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
  ) { }

  ngOnInit(): void {
    this.processing$.pipe(untilDestroyed(this)).subscribe(processing => this.headerProgress?.toggleIndeterminate(processing));
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
    this.processing$.next(true);
    this.authService
      .logIn(login!, password!)
      .pipe(
        switchMap(() => this.router.navigate(['/profile'], { replaceUrl: true })),
        tap({
          error: (e) => {
            this.loginForm.controls.login.setErrors({ response: e });
            this.loginForm.controls.password.setErrors({ response: e });
            this.processing$.next(false);
            this.toastController.create({
              color: 'danger',
              duration: 3000,
              message: "Nom d'utilisateur/e-mail et/ou mot de passe non reconnus."
            }).then(toast => toast.present());
          }
        }),
        finalize(() =>{
          this.processing$.next(false);
          this.loginForm.valueChanges.pipe(take(1)).subscribe(() => {
            this.loginForm.controls.login.updateValueAndValidity();
            this.loginForm.controls.password.updateValueAndValidity();
          });
        })
      )
      .subscribe(() => this.loginForm.setErrors(null));
  }

}
