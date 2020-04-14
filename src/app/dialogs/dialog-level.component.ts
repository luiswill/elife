import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  text: string,
  unlocked: string[]
}

@Component({
  selector: 'app-dialog-level',
  templateUrl: './dialog-level.component.html',
  styleUrls: ['./dialog-level.component.sass']
})
export class DialogLevelComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogLevelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  
  ngOnInit(): void {
    
  }

}
