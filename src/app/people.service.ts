import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class PeopleService{

  constructor(private http: HttpClient) {}

  fetchPeople(): Observable<Object> {
    return this.http.get(`http://localhost:3000/api/users`);
  }

  getUserByID(userID:number): Observable<Object> {
    return this.http.get(`http://localhost:3000/api/user/${userID}`);
  }

  delUser(elementId:number): Observable<Object> {
    return this.http.delete(`http://localhost:3000/api/user-del/${elementId}`)
  }

  editUser(id:number,name:string,username:string,email:string,phone:number,website:string): Observable<Object> {
    return this.http.patch("http://localhost:3000/api/user-edit",{
      id: id,
      name: name,
      username: username,
      email: email,
      phone: phone,
      website: website
    })
  }

  addUser(name:string,username:string,email:string,phone:number,website:string): Observable<Object> {
    return this.http.post("http://localhost:3000/api/user-new", {
      name: name,
      username: username,
      email: email,
      phone: phone,
      website: website
    })
  }
}
