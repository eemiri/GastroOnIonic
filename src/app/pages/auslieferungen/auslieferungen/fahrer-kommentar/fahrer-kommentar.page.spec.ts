import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FahrerKommentarPage } from './fahrer-kommentar.page';

describe('FahrerKommentarPage', () => {
  let component: FahrerKommentarPage;
  let fixture: ComponentFixture<FahrerKommentarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FahrerKommentarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FahrerKommentarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
