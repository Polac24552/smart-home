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
  displayedColumns: string[] = ['id', 'name', 'email', 'username', 'info', 'del','edit','delAll'];
  @ViewChild(MatTable) table: MatTable<any>;
  nameToSearch: string;
  foundPeople: Array<any> = [];
  idsToDelete: Array<any> = [];
  isChecked:boolean;

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
      if(this.dataSource.length === 0) {localStorage.clear();}

      this.table.renderRows();
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

  checkboxCheck(event:any, elementId:number){
    // console.log(event.target.checked);
    if(event.target.checked){
      const isFindIndex = this.idsToDelete.findIndex((element: number) => {
        return element === elementId;
      });
      if(elementId != isFindIndex) {
        this.idsToDelete.push(elementId)
        console.log(this.idsToDelete);
      }
    }else{
      const isFindIndex = this.idsToDelete.findIndex((element: number) => {
        return element === elementId;
      });
      if(isFindIndex > -1){
      this.idsToDelete.splice(isFindIndex, 1);
      console.log(this.idsToDelete);
      }
    }
  }

  deleteSelectedBoxes() {
    if (confirm("Are you sure to delete people with IDs: " + this.idsToDelete + " ?")) {
      if (this.idsToDelete) {
        this.idsToDelete.forEach((elementId: number) => {
          const isFindIndex = this.dataSource.findIndex((element: any) => {
            return element.id === elementId;
          });
          if (isFindIndex > -1) {
            this.dataSource.splice(isFindIndex, 1);
          }
        });

        localStorage.setItem('myData', JSON.stringify(this.dataSource));
        if (this.dataSource.length === 0) {
          localStorage.clear();
        }
        this.table.renderRows();
      }
      this.idsToDelete = [];
    }
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
      // localStorage.clear();
      this.dataFromAPI = JSON.parse(localStorage.getItem('myData') || '[]');
      this.dataSource = JSON.parse(localStorage.getItem('myData') || '[]');
    }
  }
}
