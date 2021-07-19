import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {PeopleService} from "../people.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

interface User{
  _id: number;
  name: string;
  username: string;
  email: string;
  phone: number;
  website: string;
}

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent implements OnInit, OnDestroy {

  //#region Variables
  userData: User[];
  userID: number;
  routerSubscription: Subscription;
  loadingUsersSubscription: Subscription;
  editUserSubscription: Subscription;
  bntStyle = 'user_content_input';

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  userForm: FormGroup;
  nameToAdd = new FormControl('',[Validators.required, this.noWhitespaceValidator]);
  userNameToAdd = new FormControl('', [Validators.required, this.noWhitespaceValidator]);
  emailToAdd = new FormControl('', [Validators.required, Validators.email]);
  phoneToAdd = new FormControl('', [Validators.required, Validators.minLength(9), Validators.pattern('^[0-9]{9}')]);
  webSiteToAdd = new FormControl('',[Validators.required, Validators.pattern(this.reg)]);
  //#endregion

  constructor(private route: ActivatedRoute,public peopleService: PeopleService, fb: FormBuilder) {
    this.userForm = fb.group({
      nameToAdd: this.nameToAdd,
      userNameToAdd: this.userNameToAdd,
      emailToAdd: this.emailToAdd,
      phoneToAdd: this.phoneToAdd,
      webSiteToAdd: this.webSiteToAdd
    });
  }

  undoData(){
    this.assignFormData();
    this.userForm.disable();
    this.bntStyle = 'user_content_input';
  }

  editData(){
    this.userForm.enable();
    this.bntStyle = 'user_content_input_editable';
  }

  stopEditData(){
    this.userForm.disable();
    this.bntStyle = 'user_content_input';
  }

  changeData(){
    this.editUserSubscription = this.peopleService.editUser(
      this.userData[0]._id,
      this.userForm.value.nameToAdd.trim(),
      this.userForm.value.userNameToAdd.trim(),
      this.userForm.value.emailToAdd.trim(),
      this.userForm.value.phoneToAdd,
      this.userForm.value.webSiteToAdd.trim()
    )
      .subscribe(
        data  => {
          console.log("EDIT Request: ", data);
          window.location.reload();
        },
        error  => {
          console.log("Error", error);
        });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  assignFormData(){
    this.nameToAdd.setValue(this.userData[0].name);
    this.userNameToAdd.setValue(this.userData[0].username);
    this.emailToAdd.setValue(this.userData[0].email);
    this.phoneToAdd.setValue(this.userData[0].phone);
    this.webSiteToAdd.setValue(this.userData[0].website);
  }
  takeUserFromDatabase(){
    this.loadingUsersSubscription = this.peopleService.getUserByID(this.userID)
      .subscribe((res: any) => {
        this.userData = res;
        this.assignFormData();
      }, error => {
        console.log(error);
      });
  }

  ngOnInit(): void {
    this.routerSubscription = this.route.params.subscribe(params => {
      this.userID = params['id'];
    });
    this.takeUserFromDatabase();
    this.userForm.disable();
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    this.loadingUsersSubscription?.unsubscribe();
    this.editUserSubscription?.unsubscribe();
  }
}
