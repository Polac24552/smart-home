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
  displayedColumns: string[] = ['name'];
  newNameToSet: string;
  editUserSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {}

  changeData(){
    if(!this.newNameToSet) {
      if(confirm("Nie moża wpisać pustego pola")) {return;} return;
    }

    const patchHttp = this.http.patch("http://localhost:3000/api/user-edit",{
      id: this.data.peopleToEdit._id,
      name: this.newNameToSet.trim().toString()
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
  }

  ngOnDestroy() {
    this.editUserSubscription?.unsubscribe();
  }
}
