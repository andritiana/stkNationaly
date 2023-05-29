import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveSectionsEmbeddedPagePage } from './live-sections-embedded-page.page';

describe('LiveSectionsEmbeddedPagePage', () => {
  let component: LiveSectionsEmbeddedPagePage;
  let fixture: ComponentFixture<LiveSectionsEmbeddedPagePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSectionsEmbeddedPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveSectionsEmbeddedPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
