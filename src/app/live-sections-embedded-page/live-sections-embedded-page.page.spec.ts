import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveSectionsEmbeddedPagePage } from './live-sections-embedded-page.page';

describe('LiveSectionsEmbeddedPagePage', () => {
  let component: LiveSectionsEmbeddedPagePage;
  let fixture: ComponentFixture<LiveSectionsEmbeddedPagePage>;

  beforeEach(async(() => {
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
