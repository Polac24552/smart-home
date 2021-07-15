import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class PeopleService{

  constructor(private http: HttpClient) {}

  fetchPeople(): Observable<Object> {
      return this.http.get(`http://localhost:3000/api/users`);
  }
}
