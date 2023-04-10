import { TestBed } from '@angular/core/testing';

import { PrevenirUnsavedChangesGuard } from './prevenir-unsaved-changes.guard';

describe('PrevenirUnsavedChangesGuard', () => {
  let guard: PrevenirUnsavedChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PrevenirUnsavedChangesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
