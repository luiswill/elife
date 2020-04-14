import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogUserRegistrationData } from 'src/interfaces/DialogUserRegistrationData';

@Component({
  selector: 'app-dialog-username-input',
  templateUrl: './dialog-username-input.component.html',
  styleUrls: ['./dialog-username-input.component.sass']
})
export class DialogUsernameInputComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<DialogUsernameInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogUserRegistrationData, private ngZone: NgZone) {}

  
  ngOnInit(): void {
    console.log("Data : ", this.data.country);
    
  }

  onNoClick(): void {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }

}
