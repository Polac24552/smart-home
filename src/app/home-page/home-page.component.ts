import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../home.service";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {MatCheckbox} from "@angular/material/checkbox";

export interface RoomData{
  name: string;
  state: number;
}

export interface Room {
  color: string;
  cols: number;
  rows: number;
  text: string;
  status: number;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less']
})

export class HomePageComponent implements OnInit, OnDestroy {

  Rooms: Room[] = [
    {text: 'Living Room', cols: 2, rows: 2, color: 'lightblue', status: 0},
    {text: 'Corridor', cols: 1, rows: 4, color: 'lightgreen', status: 0},
    {text: 'Kitchen', cols: 1, rows: 2, color: 'lightpink', status: 0},
    {text: 'Bedroom', cols: 2, rows: 2, color: '#DDBDF1', status: 0},
    {text: 'Bathroom', cols: 1, rows: 1, color: '#DDBDD2', status: 0},
  ];

  connectionStatus: boolean = false;
  lastTimeSync: string;
  refreshTime: number = 4500;

  isSimulation: boolean;
  simulationStatus: boolean = false;

  loadingRoomsSubscription: Subscription;
  simulationRoomsSubscription: Subscription;

  constructor(public peopleService: HomeService, public dialog: MatDialog, private router: Router) {}

  takeApiFromDatabase(){
    this.loadingRoomsSubscription = this.peopleService.getRoomData()
      .subscribe((res: any) => {
        if (!this.lastTimeSync) {
          this.lastTimeSync = res[0].last_sync_time;
          this.connectionStatus = true;
        } else {
          if (this.lastTimeSync === res[0].last_sync_time) {
            this.connectionStatus = false;
          } else {
            this.lastTimeSync = res[0].last_sync_time;
            this.connectionStatus = true;
          }
        }

        this.Rooms = [
          {text: 'Living Room', cols: 2, rows: 2, color: 'lightblue', status: res[1].state},
          {text: 'Corridor', cols: 1, rows: 4, color: 'lightgreen', status: res[0].state},
          {text: 'Kitchen', cols: 1, rows: 2, color: 'lightpink', status: res[3].state},
          {text: 'Bedroom', cols: 2, rows: 2, color: '#DDBDF1', status: res[2].state},
          {text: 'Bathroom', cols: 1, rows: 1, color: '#DDBDD2', status: res[4].state},
        ];

      }, error => {
        console.log(error);
      });
  }

  simulationPostDataToDatabase(){
    let simulationObject = {
      "name": "Corridor",
      "state": this.simulationStatus ? 1 : 0,
    }

    this.simulationRoomsSubscription = this.peopleService.postRoomData(simulationObject)
      .subscribe((res: any) => {
        this.simulationStatus = !this.simulationStatus;
      }, error => {
        console.log(error);
      });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.takeApiFromDatabase();
      if(this.isSimulation)
        this.simulationPostDataToDatabase()
    }, this.refreshTime);
  }

  ngOnDestroy() {
    this.loadingRoomsSubscription && this.loadingRoomsSubscription?.unsubscribe();
    this.simulationRoomsSubscription && this.simulationRoomsSubscription?.unsubscribe();
  }
}
