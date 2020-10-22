import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BetriebswahlPage } from './betriebswahl.page';

describe('BetriebswahlPage', () => {
  let component: BetriebswahlPage;
  let fixture: ComponentFixture<BetriebswahlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetriebswahlPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BetriebswahlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
