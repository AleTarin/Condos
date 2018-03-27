import { TestBed, inject } from '@angular/core/testing';

import { CondosService } from './condos.service';

describe('CondosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CondosService]
    });
  });

  it('should be created', inject([CondosService], (service: CondosService) => {
    expect(service).toBeTruthy();
  }));
});
