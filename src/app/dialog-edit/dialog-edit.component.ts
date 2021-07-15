import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";

interface User{
  _id: number;
  name: string;
  username: string;
  email: string;
  phone: number;
  website: string;
}

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['../home-page/home-page.component.css']
})
export class DialogEditComponent implements OnInit, OnDestroy {

  dataSource: User[];
  displayedColumns: string[] = ['name','username','email','phone','website'];
  newNameToSet: string;
  newUserNameToSet: string;
  newEmailToSet: string;
  newPhoneToSet: number;
  newWebsiteToSet: string;
  editUserSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {}

  changeData(){
    if(!(this.newNameToSet && this.newUserNameToSet && this.newEmailToSet && this.newPhoneToSet && this.newWebsiteToSet)) {
      if(confirm("Nie moża zostawić pustego pola")) {return;} return;
    }

    const patchHttp = this.http.patch("http://localhost:3000/api/user-edit",{
      id: this.data.peopleToEdit._id,
      name: this.newNameToSet.trim().toString(),
      username: this.newUserNameToSet.trim().toString(),
      email: this.newEmailToSet.trim().toString(),
      phone: this.newPhoneToSet,
      website: this.newWebsiteToSet.trim().toString()
    })
      .subscribe(
        data  => {
          console.log("EDIT Request: ", data);
          },
        error  => {
          console.log("Error", error);
        });
  }

  ngOnInit() {
    if(!this.data) { return; }
    this.dataSource = [this.data.peopleToEdit];
    this.newNameToSet = this.data.peopleToEdit.name;
    this.newUserNameToSet = this.data.peopleToEdit.username;
    this.newEmailToSet = this.data.peopleToEdit.email;
    this.newPhoneToSet = this.data.peopleToEdit.phone;
    this.newWebsiteToSet = this.data.peopleToEdit.website;
  }

  ngOnDestroy() {
    this.editUserSubscription?.unsubscribe();
  }
}
