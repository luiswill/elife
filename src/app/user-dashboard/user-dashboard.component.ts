import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass']
})
export class UserDashboardComponent implements OnInit {

  isConnected: boolean = false;


  constructor(private userService: UserService,
              public afAuth: AngularFireAuth) { }

  ngOnInit(): void {

    this.isConnected = this.userService.isUserConnected() ? true : false;
    console.log("Is user connected ", this.isConnected);
    

    this.userService.getUserFromFirebase().subscribe((user) => {
      console.log("User dashboard : ", user);

      if(user) {
        this.isConnected = true;
      }

      console.log("is connected no ", this.isConnected);
      
      
    });


  }
}
