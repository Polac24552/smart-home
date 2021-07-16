import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dialog-new-user',
  templateUrl: './dialog-new-user.component.html',
  styleUrls: ['./dialog-new-user.component.css']
})
export class DialogNewUserComponent implements OnInit, OnDestroy {

  postUsersSubscription: Subscription;
  userForm: FormGroup;
  nameToAdd = new FormControl('',[Validators.required]);
  userNameToAdd = new FormControl('', [Validators.required]);
  emailToAdd = new FormControl('', [Validators.required, Validators.email]);
  phoneToAdd = new FormControl('', [Validators.required, Validators.min(9)]);
  webSiteToAdd = new FormControl('',[Validators.required, Validators.pattern(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)]);

  constructor(private http: HttpClient,fb: FormBuilder) {
    this.userForm = fb.group({
      nameToAdd: this.nameToAdd,
      userNameToAdd: this.userNameToAdd,
      emailToAdd: this.emailToAdd,
      phoneToAdd: this.phoneToAdd,
      webSiteToAdd: this.webSiteToAdd
    });
  }


  addData(){
        this.postUsersSubscription = this.http.post("http://localhost:3000/api/user-new", {
          name: this.userForm.value.nameToAdd,
          username: this.userForm.value.userNameToAdd,
          email: this.userForm.value.emailToAdd,
          phone: this.userForm.value.phoneToAdd,
          website: this.userForm.value.webSiteToAdd
        }).subscribe(
          data  => {
            console.log("POST Request: ", data);
          },
          error  => {
            console.log("Error", error);
          });
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.postUsersSubscription?.unsubscribe();
  }
}
