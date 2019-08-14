import { TestBed } from '@angular/core/testing';

import { DailyActionsService } from './daily-actions.service';

describe('DailyActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyActionsService = TestBed.get(DailyActionsService);
    expect(service).toBeTruthy();
  });
});
