// HttpTestingController makes it easy to mock requests
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { inject, TestBed } from "@angular/core/testing";
import { PlayerStatsService } from "./player-stats.service";

describe('PlayerStatsService', () => {

  let service: PlayerStatsService;
  let httpMock: HttpTestingController;

  // Setup before each of the specs run
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlayerStatsService]
    });

    service = TestBed.inject(PlayerStatsService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('should be created', inject([PlayerStatsService], (playerStatsService: PlayerStatsService) => {
    expect(playerStatsService).toBeTruthy();
  }));

  it('should get player stats given a username', () => {
    const mockStats: {} = { key: 'value', username: "test" };
    service.getStats('test').subscribe(
      (stats: {}) => {
        expect(stats).toEqual(mockStats);
      },
      (error: any) => {

      }
    );
    const request = httpMock.expectOne(service.baseUrl + 'test');
    expect(request.request.method).toBe('GET');
    request.flush(mockStats);
  });
});
