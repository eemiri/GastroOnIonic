import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppDatenschutzPage } from './app-datenschutz.page';

describe('AppDatenschutzPage', () => {
  let component: AppDatenschutzPage;
  let fixture: ComponentFixture<AppDatenschutzPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDatenschutzPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppDatenschutzPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
