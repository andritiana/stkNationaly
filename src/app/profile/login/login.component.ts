import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    })
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { login, password } = this.loginForm.value;
    this.authService.logIn(login, password)
      .pipe(
        switchMap(() => this.router.navigate(['/profile'])),
        tap({error: e => this.loginForm.setErrors({response: e})}),
    ).subscribe(() => this.loginForm.setErrors({}));
  }

}
