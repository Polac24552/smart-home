import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BoxesComponent } from './boxes/boxes.component';
import {UserProfilePageComponent} from "./user-profile-page/user-profile-page.component";

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'boxes', component: BoxesComponent },
  { path: 'user-profile/:id', component: UserProfilePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
