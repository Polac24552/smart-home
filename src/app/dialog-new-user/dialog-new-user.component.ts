import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-dialog-new-user',
  templateUrl: './dialog-new-user.component.html',
  styleUrls: ['./dialog-new-user.component.css']
})
export class DialogNewUserComponent implements OnInit, OnDestroy {

  nameToAdd: string;
  userNameToAdd: string;
  emailToAdd: string;
  phoneToAdd: number;
  webSiteToAdd: string;
  postUsersSubscription: Subscription;

  constructor(private http: HttpClient) { }

  addData(){
    if(this.nameToAdd && this.userNameToAdd && this.emailToAdd && this.phoneToAdd && this.webSiteToAdd){
        this.postUsersSubscription = this.http.post("http://localhost:3000/api/user-new", {
          name: this.nameToAdd.trim(),
          username: this.userNameToAdd.trim(),
          email: this.emailToAdd.trim(),
          phone: this.phoneToAdd,
          website: this.webSiteToAdd.trim()
        }).subscribe(
          data  => {
            console.log("POST Request: ", data);
          },
          error  => {
            console.log("Error", error);
          });
    }
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.postUsersSubscription?.unsubscribe();
  }
}
