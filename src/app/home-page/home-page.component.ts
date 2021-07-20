import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PeopleService} from "../people.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {DialogEditComponent} from "../dialog-edit/dialog-edit.component";
import {DialogNewUserComponent} from "../dialog-new-user/dialog-new-user.component";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

interface Users{
  _id: number;
  name: string;
  username: string;
  email: string;
  phone: number;
  website: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit, OnDestroy {

  //region Variables
  dataSource: Users[];
  displayedColumns: string[] = ['lp', 'name', 'username', 'email', 'info', 'del','edit','delAll'];
  @ViewChild(MatTable) table: MatTable<any>;
  nameToSearch: string;
  foundPeople: Array<any> = [];
  idsToDelete: Array<any> = [];
  isChecked:boolean;
  loadingUsersSubscription: Subscription;
  delUsersSubscription: Subscription;
  lp: number = 0;
  boxes = document.getElementsByName("box");
  //endregion

  constructor(public peopleService: PeopleService, public dialog: MatDialog, private router: Router) {}

  //region Functions
  showProfile(elementId: number) {
    const person = this.dataSource.find((element: any) => {
      return element._id === elementId;
    });
    if(!person){return;}

    this.router.navigate(['/user-profile', elementId]).then(r => console.log('User found: ',r));

    //let dialogRef:any;

    //if(this.dialog.openDialogs.length === 0) {
    //   dialogRef = this.dialog.open(DialogComponent, {
    //    data: {
    //      people: person
    //    }
    //  });

    //  dialogRef.afterClosed().subscribe((result:any) => {
    //    console.log(`Dialog result: ${result}`);
    //  });
    //}
  }

  editData(elementId: number){
    const person = this.dataSource.find((element: any) => {
      return element._id === elementId;
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
        this.takeApiFromDatabase();
        this.table.renderRows();
      });
    }
  }

  removeData(elementId: number) {
    if(confirm("Are you sure to delete person with ID: "+elementId+" ?")) {
      const isFindIndex = this.dataSource.findIndex((element: any) => {
        return element._id === elementId;
      });
      if(isFindIndex < 0){return;}

      this.delUsersSubscription = this.peopleService.delUser(elementId)
        .subscribe(
        data  => {
          console.log("DELETE Request: ", data);
          this.takeApiFromDatabase();
          this.table.renderRows();
        },
        error  => {
          console.log("Error", error);
        });
    }
  }

  searchForName(){
    this.foundPeople = [];
    if(!this.nameToSearch){this.restartTable();}

    this.dataSource.find((element: any) => {
      if(element.name.toString().toLowerCase().includes(this.nameToSearch.toLowerCase().trim())){
        this.foundPeople.push(element);
      }
    });

    this.dataSource = this.foundPeople;
    this.table.renderRows();
  }

  restartTable(){
    this.takeApiFromDatabase();
    this.table.renderRows();
  }

  checkboxCheck(event:any, elementId:number){
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
    if (this.idsToDelete.length > 0) {
      if (confirm("Are you sure to delete selected users ?")) {
        this.idsToDelete.forEach((elementId: any) => {
            const isFindIndex = this.dataSource.findIndex((element: any) => {
            return element._id === elementId;
          });
          if (isFindIndex > -1) {
            this.delUsersSubscription = this.peopleService.delUser(elementId)
              .subscribe(
                data  => {
                  console.log("DELETE Request: ", data);
                  this.takeApiFromDatabase();
                  this.table.renderRows();
                },
                error  => {
                  console.log("Error", error);
                });
          }
        });
        this.takeApiFromDatabase();
        this.table.renderRows();
      }
      this.idsToDelete = [];
    }else{
      for (let i = 0; i < this.boxes.length; i++) {
        (this.boxes[i] as HTMLInputElement).checked = true;
        this.idsToDelete.push((this.boxes[i] as HTMLInputElement).value);
        console.log(this.idsToDelete);
      }
    }
  }

  addData(){
    let dialogRef:any;

    if(this.dialog.openDialogs.length === 0) {
      dialogRef = this.dialog.open(DialogNewUserComponent);

      dialogRef.afterClosed().subscribe((result:any) => {
        this.takeApiFromDatabase();
        this.table.renderRows();
      });
    }
  }

  takeApiFromDatabase(){
    this.loadingUsersSubscription = this.peopleService.fetchPeople()
      .subscribe((res: any) => {
        this.dataSource = res;
      }, error => {
        console.log(error);
      });
  }

  ngOnInit(): void {
    this.takeApiFromDatabase();
  }

  ngOnDestroy() {
    this.loadingUsersSubscription?.unsubscribe();
    this.delUsersSubscription?.unsubscribe()
  }
  //endregion
}
