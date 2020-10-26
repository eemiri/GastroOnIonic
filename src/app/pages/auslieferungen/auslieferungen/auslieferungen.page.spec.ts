import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuslieferungenPage } from './auslieferungen.page';

describe('AuslieferungenPage', () => {
  let component: AuslieferungenPage;
  let fixture: ComponentFixture<AuslieferungenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuslieferungenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuslieferungenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
