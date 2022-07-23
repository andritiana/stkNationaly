import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import type { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import type { Profile } from './profile.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  myProfile$: Observable<Profile>;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

  }
  ionViewDidEnter(): void {
    this.myProfile$ = this.profileService.getMyProfile();
  }

  logOut() {
    this.authService.logOut();
  }

}
