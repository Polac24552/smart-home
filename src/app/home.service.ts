import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {RoomData} from "./home-page/home-page.component";

@Injectable()
export class HomeService {

  baseUrl = environment.baseUrl;
  getRoomDataUrl = environment.getRoomDataUrl;
  postRoomDataUrl = environment.postRoomDataUrl;

  constructor(private http: HttpClient) {}

  getRoomData(): Observable<Object> {
    return this.http.get(this.getRoomDataUrl);
  }

  postRoomData(roomDataToSend: RoomData): Observable<Object> {
    return this.http.post(this.postRoomDataUrl, roomDataToSend, {responseType: 'arraybuffer'});
  }
}
