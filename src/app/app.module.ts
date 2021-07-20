import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {HomePageComponent} from './home-page/home-page.component';
import { BoxesComponent } from './boxes/boxes.component';
import { HttpClientModule } from "@angular/common/http";
import {PeopleService} from "./people.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatTableModule, MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NgMatSearchBarModule} from "ng-mat-search-bar";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogComponent} from './dialog/dialog.component';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';
import { DialogNewUserComponent } from './dialog-new-user/dialog-new-user.component';
import {MatInputModule} from "@angular/material/input";
import { UserProfilePageComponent } from './user-profile-page/user-profile-page.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    BoxesComponent,
    DialogComponent,
    DialogEditComponent,
    DialogNewUserComponent,
    UserProfilePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    NgMatSearchBarModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatIconModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [
    PeopleService,
    MatTableDataSource,
    DialogComponent,
    DialogEditComponent,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'always'}}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
