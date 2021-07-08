import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {PeopleService} from "../people.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  peopleToPrint$:any;
  dataSource:any;
  displayedColumns: string[] = ['id', 'name', 'email', 'username', 'info', 'del'];
  @ViewChild(MatTable) table: MatTable<any>;
  //search = new FormControl('');
  nameToSearch: string;

  //tworzymy połączenie z peopleservice aby mieć dostęp do jej funkcji zwracającej array
  constructor(public peopleService: PeopleService, public dialog: MatDialog) {}

  openDialog(elementId: number) {
    let peopleToShow = this.peopleToPrint$.find((element: any) => {
      return element.id === elementId;
    });

    let dialogRef:any;

    if(this.dialog.openDialogs.length==0) {
       dialogRef = this.dialog.open(DialogContentExampleDialog, {
        data: {
          people: peopleToShow
        }
      });

      dialogRef.afterClosed().subscribe((result:any) => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  removeData(elementId: number) {
    let isFindIndex = this.peopleToPrint$.findIndex((element: any) => {
      return element.id === elementId;
    });

    this.peopleToPrint$.splice(isFindIndex, 1);
    this.dataSource = this.peopleToPrint$;
    this.table.renderRows();
  }

  foundPpl: Array<any> = [];

  searchForName(){
    this.foundPpl = [];
    if(this.nameToSearch == null){this.restartTable();}

    this.peopleToPrint$.find((element: any) => {
      if(element.name.toString().toLowerCase().includes(this.nameToSearch.toLowerCase())){
        this.foundPpl.push(element);
      }
    });

    this.dataSource = this.foundPpl;
    this.table.renderRows();
  }

  restartTable(){
    this.dataSource = this.peopleToPrint$;
    this.table.renderRows();
  }

  ngOnInit(): void {
    //przy załadowaniu wywołujemy funkcje
      this.peopleService.fetchPeople().subscribe(res => {
      this.peopleToPrint$ = res;
      this.dataSource = res;
    })
  }

  transform(value: any, ...args: any[]): any {
  }
}

//------------------------------------------------------------DialogInfo

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
  styleUrls: ['./home-page.component.css']
})

export class DialogContentExampleDialog implements OnInit{

  dataSource:any;
  displayedColumns2: string[] = ['website','phone'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.dataSource = [this.data.people];
  }
}
