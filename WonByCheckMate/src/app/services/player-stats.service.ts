import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChessStats } from '../models/chess-stats.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {
  baseUrl: string = "https://localhost:5001/api/chessstats/";
  constructor(private http: HttpClient) { }

  getStats(username: string): Observable<ChessStats> {
    return this.http.get<ChessStats>(this.baseUrl + username);
  }

  // TODO:
  // Returns json but as a flattened json
  // flattenData(data: {}): {} | null {
  //   return null;
  // }

}