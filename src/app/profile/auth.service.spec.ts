import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import type { ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { Subject, firstValueFrom } from 'rxjs';
import { async } from '../../testing';
import { FpmaApiService } from '../services/fpma-api.service';
import { StorageService } from '../utils/storage.service';
import { AUTH_STORAGE_KEY, AuthService, JwtPayload, REFRESH_STORAGE_KEY, jwtOptionsFactory } from './auth.service';

describe('AuthService', () => {
  let svc: AuthService;
  let http: HttpTestingController;
  let storage: StorageService;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: FpmaApiService, useValue: jasmine.createSpyObj<FpmaApiService>('FpmaApiService', ['isDevMode']) },
        // { provide: HttpClient, useValue: jasmine.createSpyObj<HttpClient>('', ['post']) },
        { provide: StorageService, useClass: TestStorageService },
        {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
        },
        AuthService,
        JwtHelperService,
      ],
    });
    // .overrideModule(AppModule, {
    //   remove: {imports: [HttpClientModule, AppRoutingModule], declarations: [AppComponent], bootstrap: [AppComponent]}
    // })
    // .compileComponents();
    svc = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);

    spyOn(TestBed.inject(JwtHelperService), 'decodeToken').and.returnValue({
      sub: 'test-user-id',
    } as JwtPayload);
    storage = TestBed.inject(StorageService);
    // injectSpy(StorageService).set.and.callFake((k,v) => Promise.resolve(v));
  });

  it('refresh', async () => {
    await login();

    const refresh = firstValueFrom(svc.refresh());
    async(() => http.expectOne(refreshMatcher).flush({ accessToken: 'accessToken2', refreshToken: 'refreshToken2' }));
    await refresh.then((res) => {
      expect(res).toEqual(['accessToken2', 'refreshToken2']);
    });

    await expectAsync(storage.get(REFRESH_STORAGE_KEY)).toBeResolvedTo('refreshToken2');
    await expectAsync(storage.get(AUTH_STORAGE_KEY)).toBeResolvedTo('accessToken2');

    return;
  });

  it('concurrent refresh', async () => {
    await login();

    let counter = 0;
    const refresh1 = firstValueFrom(svc.refresh()).then((res) => {
      console.log('first')
      expect(res).toBeDefined();
      expect(counter).withContext('should emit first').toBe(0);
      counter++;
    });
    const refresh2 = firstValueFrom(svc.refresh()).then((res) => {
      console.log('second')
      expect(res).toBeNull();
      expect(counter).withContext('should emit after the first refresh').toBe(1);
    });
    const refreshReq = http.expectOne(refreshMatcher);

    await expectAsync(refresh1).toBePending();
    await expectAsync(refresh2).toBePending();
    await async(() => refreshReq.flush({ accessToken: 'accessToken2', refreshToken: 'refreshToken2' }));
    await expectAsync(refresh1).toBeResolved();
    await expectAsync(refresh2).toBeResolved();
    http.expectNone(refreshMatcher);

    await expectAsync(storage.get(REFRESH_STORAGE_KEY)).toBeResolvedTo('refreshToken2');
    await expectAsync(storage.get(AUTH_STORAGE_KEY)).toBeResolvedTo('accessToken2');

    return;
  });

  fit('refresh with error', async () => {
    await login();

    let counter = 0;
    const refresh1 = firstValueFrom(svc.refresh()).then((res) => {
      console.log('first')
      expect(res).toBeDefined();
      expect(counter).withContext('should emit first').toBe(0);
      counter++;
    });
    // const refresh2 = firstValueFrom(svc.refresh()).then((res) => {
    //   console.log('second')
    //   expect(res).toBeNull();
    //   expect(counter).withContext('should emit after the first refresh').toBe(1);
    // });
    let refreshReq = http.expectOne(refreshMatcher);

    await expectAsync(refresh1).toBePending();
    // await expectAsync(refresh2).toBePending();
    await async(() => refreshReq.flush('Refresh périmé', { status: 400, statusText: 'une erreur' }));
    await expectAsync(refresh1).toBePending();
    console.log('1st retry')
    await async(() => http.expectOne(refreshMatcher).flush('Refresh périmé', { status: 400, statusText: 'une erreur' }));
    await expectAsync(refresh1).toBePending();
    console.log('2nd retry')
    await async(() => http.expectOne(refreshMatcher).flush('Refresh périmé', { status: 400, statusText: 'une erreur' }));
    await expectAsync(refresh1).toBePending();
    console.log('3rd retry')
    await async(() => http.expectOne(refreshMatcher).flush('Refresh périmé', { status: 400, statusText: 'une erreur' }));
    await expectAsync(refresh1).toBePending();
    console.log('4th')
    // await expectAsync(refresh2).toBeResolved();
    http.expectNone(refreshMatcher);

    await expectAsync(storage.get(REFRESH_STORAGE_KEY)).toBeResolvedTo('refreshToken2');
    await expectAsync(storage.get(AUTH_STORAGE_KEY)).toBeResolvedTo('accessToken2');

    return;
  });


  async function login() {
    const requests = new Map<string, { body: unknown; response: Subject<AuthPairResponse> }[]>();
    // const post = http.post
    //   .withArgs(jasmine.stringMatching(/auth$/), jasmine.objectContaining({ login: 'test', password: 'myPassword' }))
    //   .and.returnValue(of({ accessToken: 'accessToken', refreshToken: 'refreshToken' })).and.callFake((url: string, body) => {
    //     const testReq = { body, response: new Subject<AuthPairResponse>() };
    //     requests.set(url, [...requests.get(url) ?? [], testReq]);
    //     return testReq.response;
    //   });
    const login = firstValueFrom(svc.logIn('test', 'myPassword'));
    http
      .expectOne((req) => !!req.url.match(/auth$/))
      .flush({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
    await login;
    // expect(post).toHaveBeenCalledTimes(1);
    await expectAsync(storage.get(REFRESH_STORAGE_KEY)).toBeResolvedTo('refreshToken');
    await expectAsync(storage.get(AUTH_STORAGE_KEY)).toBeResolvedTo('accessToken');
    return;
  }

  function refreshMatcher(req: HttpRequest<AuthPairResponse>) {
    return !!req.url.match(/auth\/token\/refresh$/);
  }
});

function injectSpy<Service>(token: ProviderToken<Service>) {
  return TestBed.inject(token) as jasmine.SpyObj<Service>;
}

class TestStorageService implements Omit<StorageService, 'storage'> {
  #storage = new Map<string, unknown>();

  get<V = unknown>(key: string): Promise<V> {
    return Promise.resolve(this.#storage.get(key) as V);
  }
  set<V = unknown>(key: string, value: V): Promise<V> {
    this.#storage.set(key, value);
    return Promise.resolve(value);
  }
}

interface AuthPairResponse {
  accessToken: string;
  refreshToken: string;
}
