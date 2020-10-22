import { TestBed } from '@angular/core/testing';

import { CalendarproviderService } from './calendarprovider.service';

describe('CalendarproviderService', () => {
  let service: CalendarproviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarproviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
