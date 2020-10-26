import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AusliefererMapPage } from './auslieferer-map.page';

describe('AusliefererMapPage', () => {
  let component: AusliefererMapPage;
  let fixture: ComponentFixture<AusliefererMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AusliefererMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AusliefererMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
