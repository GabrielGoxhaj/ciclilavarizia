import { TestBed } from '@angular/core/testing';

import { MockBackend } from './mock-backend';

describe('MockBackend', () => {
  let service: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
