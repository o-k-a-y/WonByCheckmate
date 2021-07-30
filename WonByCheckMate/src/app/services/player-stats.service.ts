import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {
  baseUrl: string = "https://localhost:5001/api/chessstats/";
  constructor(private http: HttpClient) { }

  getStats(username: string): Observable<{}> {
    return this.http.get<{}>(this.baseUrl + username);
  }

  // TODO:
  // Returns json but as a flattened json
  flattenData(data: {}): {} {
    return null;
  }

}