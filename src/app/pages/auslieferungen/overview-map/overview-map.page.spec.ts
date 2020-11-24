import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OverviewMapPage } from './overview-map.page';

describe('OverviewMapPage', () => {
  let component: OverviewMapPage;
  let fixture: ComponentFixture<OverviewMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
