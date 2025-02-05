import { TestBed } from '@angular/core/testing';

import { GedServiceService } from './ged-service.service';

describe('GedServiceService', () => {
  let service: GedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
