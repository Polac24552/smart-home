import {Component, OnInit, ViewChild} from '@angular/core';
import {PeopleService} from "../people.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {DialogComponent} from "../dialog/dialog.component";
import {DialogEditComponent} from "../dialog-edit/dialog-edit.component";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  dataFromAPI:any;
  dataSource:any;
  displayedColumns: string[] = ['id', 'name', 'email', 'username', 'info', 'del','edit'];
  @ViewChild(MatTable) table: MatTable<any>;
  nameToSearch: string;
  foundPeople: Array<any> = [];

  constructor(public peopleService: PeopleService, public dialog: MatDialog) {}

  openDialog(elementId: number) {
    const person = this.dataFromAPI.find((element: any) => {
      return element.id === elementId;
    });
    if(!person){return;}
    let dialogRef:any;

    if(this.dialog.openDialogs.length === 0) {
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

  editData(elementId: number){
    const person = this.dataFromAPI.find((element: any) => {
      return element.id === elementId;
    });
    if(!person){return;}
    let dialogRef:any;

    if(this.dialog.openDialogs.length === 0) {
      dialogRef = this.dialog.open(DialogEditComponent, {
        data: {
          peopleToEdit: person
        }
      });

      dialogRef.afterClosed().subscribe((result:any) => {
        this.dataSource = JSON.parse(localStorage.getItem('myData') || '[]');
        this.table.renderRows();
      });
    }
  }

  removeData(elementId: number) {
    if(confirm("Are you sure to delete person with ID: "+elementId+" ?")) {
      const isFindIndex = this.dataFromAPI.findIndex((element: any) => {
        return element.id === elementId;
      });
      if(isFindIndex < 0){return;}

      this.dataFromAPI.splice(isFindIndex, 1);
      this.dataSource = this.dataFromAPI;
      localStorage.setItem('myData', JSON.stringify(this.dataSource));
      this.table.renderRows();

      if(this.dataSource.length === 0) {localStorage.clear();}
    }
    return;
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
    if(localStorage.getItem('myData') == null) {
      this.peopleService.fetchPeople().subscribe(res => {
        this.dataFromAPI = res;
        this.dataSource = res;
        localStorage.setItem('myData', JSON.stringify(this.dataFromAPI));
      }, error => {
        console.log('localStorage not null');
      });
    }else{
      this.dataFromAPI = JSON.parse(localStorage.getItem('myData') || '[]');
      this.dataSource = JSON.parse(localStorage.getItem('myData') || '[]');
    }
  }
}
