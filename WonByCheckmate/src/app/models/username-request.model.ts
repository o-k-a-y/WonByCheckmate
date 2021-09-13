import { HttpParams } from "@angular/common/http";

export interface UsernameRequest {
  username: string,
  queryParams: HttpParams | undefined
}