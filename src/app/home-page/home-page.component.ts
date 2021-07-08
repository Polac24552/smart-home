import {Component, OnInit, ViewChild} from '@angular/core';
import {PeopleService} from "../people.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  dataFromAPI:any;
  dataSource:any;
  displayedColumns: string[] = ['id', 'name', 'email', 'username', 'info', 'del'];
  @ViewChild(MatTable) table: MatTable<any>;
  nameToSearch: string;
  foundPeople: Array<any> = [];

  constructor(public peopleService: PeopleService, public dialog: MatDialog) {}

  openDialog(elementId: number) {
    const person = this.dataFromAPI.find((element: any) => {
      return element.id === elementId;
    });

    let dialogRef:any;

    if(this.dialog.openDialogs.length===0) {
       dialogRef = this.dialog.open(DialogComponent, {
        data: {
          people: person
        }
      });

      dialogRef.afterClosed().subscribe((result:any) => {
        console.log(`Dialog result: ${result}`);
      });
    }

  }

  removeData(elementId: number) {
    const isFindIndex = this.dataFromAPI.findIndex((element: any) => {
      return element.id === elementId;
    });

    this.dataFromAPI.splice(isFindIndex, 1);
    this.dataSource = this.dataFromAPI;
    this.table.renderRows();
  }

  searchForName(){
    this.foundPeople = [];
    if(!this.nameToSearch){this.restartTable();}

    this.dataFromAPI.find((element: any) => {
      if(element.name.toString().toLowerCase().includes(this.nameToSearch.toLowerCase().trim())){
        this.foundPeople.push(element);
      }
    });

    this.dataSource = this.foundPeople;
    this.table.renderRows();
  }

  restartTable(){
    this.dataSource = this.dataFromAPI;
    this.table.renderRows();
  }

  ngOnInit(): void {
    this.peopleService.fetchPeople().subscribe(res => {
      this.dataFromAPI = res;
      this.dataSource = res;
    })
  }
}
