import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'elife';
  public now: string = new Date().toUTCString();


  constructor() {

  }



}
