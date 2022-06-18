import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from "../environments/environment";

@Injectable()
export class PeopleService{

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  fetchPeople(): Observable<Object> {
    return this.http.get(this.baseUrl+'/users');
  }

  getUserByID(userID:number): Observable<Object> {
    return this.http.get(this.baseUrl+`/user/${userID}`);
  }

  delUser(elementId:number): Observable<Object> {
    return this.http.delete(this.baseUrl+`/user-del/${elementId}`)
  }

  editUser(id:number,name:string,username:string,email:string,phone:number,website:string): Observable<Object> {
    return this.http.patch(this.baseUrl+'/user-edit',{
      id: id,
      name: name,
      username: username,
      email: email,
      phone: phone,
      website: website
    })
  }

  addUser(name:string,username:string,email:string,phone:number,website:string): Observable<Object> {
    return this.http.post(this.baseUrl+"/user-new", {
      name: name,
      username: username,
      email: email,
      phone: phone,
      website: website
    })
  }
}
