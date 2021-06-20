import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AgendaTabPage } from './agenda-tab.page';

describe('AgendaTabPage', () => {
  let component: AgendaTabPage;
  let fixture: ComponentFixture<AgendaTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
