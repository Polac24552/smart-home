import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PeopleService} from "../people.service";

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

  //region Variables
  dataSource: User[];
  displayedColumns: string[] = ['name','username','email','phone','website'];
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  userForm: FormGroup;
  nameToAdd = new FormControl('',[Validators.required, this.noWhitespaceValidator]);
  userNameToAdd = new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  emailToAdd = new FormControl('', [Validators.required, Validators.email]);
  phoneToAdd = new FormControl('', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]{9}')]);
  webSiteToAdd = new FormControl('',[Validators.required, Validators.pattern(this.reg)]);
  editUserSubscription: Subscription;
  //endregion

  constructor(public peopleService: PeopleService, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient,fb: FormBuilder) {
    this.userForm = fb.group({
      nameToAdd: this.nameToAdd,
      userNameToAdd: this.userNameToAdd,
      emailToAdd: this.emailToAdd,
      phoneToAdd: this.phoneToAdd,
      webSiteToAdd: this.webSiteToAdd
    });
  }

  //region Functions
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  changeData(){
    this.editUserSubscription = this.peopleService.editUser(
      this.data.peopleToEdit._id,
      this.userForm.value.nameToAdd.trim(),
      this.userForm.value.userNameToAdd.trim(),
      this.userForm.value.emailToAdd.trim(),
      this.userForm.value.phoneToAdd,
      this.userForm.value.webSiteToAdd.trim()
    )
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
    this.nameToAdd.setValue(this.data.peopleToEdit.name);
    this.userNameToAdd.setValue(this.data.peopleToEdit.username);
    this.emailToAdd.setValue(this.data.peopleToEdit.email);
    this.phoneToAdd.setValue(this.data.peopleToEdit.phone);
    this.webSiteToAdd.setValue(this.data.peopleToEdit.website);
  }

  ngOnDestroy() {
    this.editUserSubscription?.unsubscribe();
  }
  //endregion
}
