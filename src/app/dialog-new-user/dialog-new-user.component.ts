import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from "rxjs";
import {PeopleService} from "../people.service";

@Component({
  selector: 'app-dialog-new-user',
  templateUrl: './dialog-new-user.component.html',
  styleUrls: ['./dialog-new-user.component.css']
})

export class DialogNewUserComponent implements OnInit, OnDestroy {

  //region Variables
  postUsersSubscription: Subscription;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  userForm: FormGroup;
  nameToAdd = new FormControl('',[Validators.required, this.noWhitespaceValidator]);
  userNameToAdd = new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  emailToAdd = new FormControl('', [Validators.required, Validators.email]);
  phoneToAdd = new FormControl('', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]{9}')]);
  webSiteToAdd = new FormControl('',[Validators.required, Validators.pattern(this.reg)]);
  //endregion

  constructor(fb: FormBuilder,public peopleService: PeopleService) {
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
  addData(){
        this.postUsersSubscription = this.peopleService.addUser(
          this.userForm.value.nameToAdd.trim(),
          this.userForm.value.userNameToAdd.trim(),
          this.userForm.value.emailToAdd.trim(),
          this.userForm.value.phoneToAdd,
          this.userForm.value.webSiteToAdd.trim()
        ).subscribe(
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
  //endregion
}
