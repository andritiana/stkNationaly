import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { filter, finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { HeaderProgressBar } from 'src/app/global-header/global-header.component';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';

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
  processing$ = new BehaviorSubject(false);
  resetPasswordNavState$?: Observable<{ email: string } | null>;

  @ViewChild(HeaderProgressBar)
  private headerProgress: HeaderProgressBar | undefined;
  private location = inject(Location);

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
    });

    const loginCtrl = this.loginForm.controls.login;
    this.resetPasswordNavState$ = loginCtrl.valueChanges.pipe(
      map(email => (Validators.email(loginCtrl) ? null : { email })),
    )
  }

  ionViewDidEnter() {
    const navState = this.location.getState() as {email: string} | null;
    if (navState?.email) {
      this.loginForm.controls.login.setValue(navState.email);
    }
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
          error: (e: unknown) => {
            if (e instanceof HttpErrorResponse && e.status === 401) {
              this.loginForm.controls.login.setErrors({ credentials: 'Vérifier' });
              this.loginForm.controls.password.setErrors({ credentials: 'Vérifier' });
            }
            this.processing$.next(false);
            void this.toastController.create({
              color: 'danger',
              duration: 3000,
              message: "Nom d'utilisateur/e-mail et/ou mot de passe non reconnus."
            }).then(toast => toast.present());
          }
        }),
        finalize(() =>{
          this.processing$.next(false);
          void firstValueFrom(this.loginForm.valueChanges).then(() => {
            this.loginForm.controls.login.updateValueAndValidity();
            this.loginForm.controls.password.updateValueAndValidity();
          });
        })
      )
      .subscribe(() => this.loginForm.setErrors(null));
  }

}
