import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['../home-page/home-page.component.css']
})

export class DialogComponent implements OnInit {

  //region Variables
  dataSource:any;
  displayedColumns: string[] = ['website','phone'];
  //endregion

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if(!this.data) { return; }
    this.dataSource = [this.data.people];
  }
}
