import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PasswortVergessenPage } from './passwort-vergessen.page';

describe('PasswortVergessenPage', () => {
  let component: PasswortVergessenPage;
  let fixture: ComponentFixture<PasswortVergessenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswortVergessenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswortVergessenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
