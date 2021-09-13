import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChessStats } from '../models/chess-stats.model';
import { UsernameRequest } from '../models/username-request.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {
  baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getStats(request: UsernameRequest): Observable<ChessStats> {
    return this.http.get<ChessStats>(`${this.baseUrl}/chessstats/${request.username}`, {
      params: request.queryParams
    });
  }

  // TODO:
  // Returns json but as a flattened json
  // flattenData(data: {}): {} | null {
  //   return null;
  // }

}