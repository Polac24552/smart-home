import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['../home-page/home-page.component.css']
})
export class DialogEditComponent implements OnInit {

  dataSource: any;
  displayedColumns: string[] = ['name'];
  newNameToSet: string;
  localData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  changeData(){
    if(!this.newNameToSet) {
      if(confirm("Nie moża wpisać pustego pola")) {return;} return;
    }

    this.localData = JSON.parse(localStorage.getItem('myData') || '[]');

    this.localData.find((element: any) => {
      if(element.id === this.data.peopleToEdit.id){
        element.name = this.newNameToSet.trim().toString();
      }
    });
    localStorage.setItem('myData', JSON.stringify(this.localData));
    window.location.reload();
  }

  ngOnInit() {
    if(!this.data) { return; }
    this.dataSource = [this.data.peopleToEdit];
    this.newNameToSet = this.data.peopleToEdit.name;
  }
}
