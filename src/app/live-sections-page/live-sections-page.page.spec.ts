import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveSectionsPagePage } from './live-sections-page.page';

describe('LiveSectionsPagePage', () => {
  let component: LiveSectionsPagePage;
  let fixture: ComponentFixture<LiveSectionsPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSectionsPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveSectionsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
