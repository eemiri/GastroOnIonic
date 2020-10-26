import { TestBed } from '@angular/core/testing';

import { AuslieferungenService } from './auslieferungen.service';

describe('AuslieferungenService', () => {
  let service: AuslieferungenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuslieferungenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
