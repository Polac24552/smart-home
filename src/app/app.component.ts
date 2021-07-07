import {Component, OnDestroy} from '@angular/core';
import {PeopleService} from "./people.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy{
  title = 'my-app';

  public people$: any;

  constructor(private peopleService: PeopleService) {}

  fetchPeople(){
    this.people$ = this.peopleService.fetchPeople();
  }
  //załadowanie danych przy załadowaniu strony
  ngOnInit(): void {
    this.fetchPeople();
  }

  ngOnDestroy(){
  }
}


