import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PresentationTabPage } from './presentation-tab.page';

describe('PresentationTabPage', () => {
  let component: PresentationTabPage;
  let fixture: ComponentFixture<PresentationTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PresentationTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PresentationTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
