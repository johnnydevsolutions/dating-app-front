import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ContaService } from './conta.service';

fdescribe('ContaService', () => {
  let service: ContaService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({

      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ContaService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ele deve chamar o método post com o endpoint correto', () => {
    const spy = spyOn(http, 'post').and.callThrough();
    service.register({} as any);
    expect(spy).toHaveBeenCalled();
});
});

