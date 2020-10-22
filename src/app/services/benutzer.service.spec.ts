import { TestBed } from '@angular/core/testing';

import { BenutzerService } from './benutzer.service';

describe('BenutzerService', () => {
  let service: BenutzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BenutzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
