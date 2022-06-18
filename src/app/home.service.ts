import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from "../environments/environment";

@Injectable()
export class HomeService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  fetchRooms(): Observable<Object> {
    return this.http.get(this.baseUrl+'/rooms');
  }

}
