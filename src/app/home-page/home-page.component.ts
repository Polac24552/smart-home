import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../home.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

interface Rooms{
  _id: number;
  name: string;
  state: string;
  temp: number;
  lastUpdate: string;
}

export interface Room {
  color: string;
  cols: number;
  rows: number;
  text: string;
  status: boolean;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less']
})

export class HomePageComponent implements OnInit, OnDestroy {

  Rooms: Room[] = [
    {text: 'Living Room', cols: 2, rows: 2, color: 'lightblue', status: false},
    {text: 'Corridor', cols: 1, rows: 4, color: 'lightgreen', status: false},
    {text: 'Kitchen', cols: 1, rows: 2, color: 'lightpink', status: false},
    {text: 'Bedroom', cols: 2, rows: 2, color: '#DDBDF1', status: false},
    {text: 'Bathroom', cols: 1, rows: 1, color: '#DDBDD2', status: false},
  ];

  connectionStatus: boolean = false;
  lastTimeSync: string;
  roomData: any;
  lp: number = 0;

  loadingRoomsSubscription: Subscription;

  constructor(public peopleService: HomeService, public dialog: MatDialog, private router: Router) {}

  takeApiFromDatabase(){
    this.loadingRoomsSubscription = this.peopleService.fetchRooms()

      .subscribe((res: any) => {
        console.log(res);
        this.connectionStatus = true;
        this.roomData = <Rooms>res;
      }, error => {
        console.log(error);
      });
  }

  ngOnInit(): void {
    this.takeApiFromDatabase();
  }

  ngOnDestroy() {
    this.loadingRoomsSubscription?.unsubscribe();
  }
}
