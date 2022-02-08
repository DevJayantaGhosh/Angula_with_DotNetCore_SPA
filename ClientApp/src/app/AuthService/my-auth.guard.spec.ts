import { TestBed } from '@angular/core/testing';

import { MyAuthGuard } from './my-auth.guard';

describe('MyAuthGuard', () => {
  let guard: MyAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MyAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
