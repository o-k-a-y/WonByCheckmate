import { TestBed, inject } from "@angular/core/testing";
import { HttpEvent, HttpEventType } from "@angular/common/http";


// HttpTestingController makes it easy to mock requests
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';


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
        service.getStats('test').subscribe((stats: {}) => {
            expect(stats).toEqual(mockStats);
        });

        const request = httpMock.expectOne(service.baseUrl + 'test');
        expect(request.request.method).toBe('GET');
        request.flush(mockStats);
    });

    // it('should get player stats given a username',
    //     inject([HttpTestingController, PlayerStatsService],
    //         (httpMock: HttpTestingController, playerStatsService: PlayerStatsService) => {
    //             const mockStats: {} = { key: 'value', username: "test" };

    //             let response = null;

    //             playerStatsService.getStats('test').subscribe(
    //                 (stats: JSON) => {
    //                     response = stats;
    //                 },
    //                 (error: any) => {
    //                     //
    //                 }
    //             )

    //             expect(response).toEqual(mockStats);
    //         }
    //     )
    // )
});