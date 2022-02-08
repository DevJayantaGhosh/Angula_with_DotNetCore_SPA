import { TestBed } from '@angular/core/testing';

import { MyJwtDecodeService } from './my-jwt-decode.service';

describe('MyJwtDecodeService', () => {
  let service: MyJwtDecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyJwtDecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
