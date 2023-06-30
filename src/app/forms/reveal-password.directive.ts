import type { OnInit} from '@angular/core';
import { Directive, HostBinding, Input, inject } from '@angular/core';
import { IonIcon, IonInput } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import type { Observable} from 'rxjs';
import { BehaviorSubject, map } from 'rxjs';

@UntilDestroy()
@Directive({ selector: '[passwordRevelator]', exportAs: 'revelator', standalone: true })
export class PasswordRevelatorDirective implements OnInit {
  icon$: Observable<"eye-off" | "eye">;
  input = inject(IonInput, { self: true });
  public reveal$ = new BehaviorSubject(false);

  @Input()
  icon?: IonIcon;
  @HostBinding('class')
  klass = 'pr-input-with-icon';


  constructor() {
    this.icon$ = this.reveal$.pipe(map((reveal) => (reveal ? 'eye-off' : 'eye')));
  }

  ngOnInit() {
    this.reveal$
      .pipe(
        map((reveal) => (reveal ? 'text' : 'password')),
        untilDestroyed(this)
      )
      .subscribe((inputType) => (this.input.type = inputType));

    this.icon$.pipe(untilDestroyed(this)).subscribe((iconName) => {
      if (this.icon) {
        this.icon.name = iconName;
      }
    });
  }

  toggle() {
    this.reveal$.next(!this.reveal$.value);
  }
}
