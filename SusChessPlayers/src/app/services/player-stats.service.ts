import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { GameResultType } from '../models/game-result-type';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PlayerStatsService {
    baseUrl: string = "https://localhost:5001/api/chessstats/";
    constructor(private http: HttpClient) {}

    getStats(username: string): Observable<JSON> {
        return this.http.get<JSON>(this.baseUrl + username);
    }

}