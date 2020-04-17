import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

// Services
import { UserService } from 'src/services/user.service';
import { User } from 'firebase';

//Interfaces
import { Citizien } from '../../interfaces/Citizien.interface';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})

export class UserProfileComponent implements OnInit {
  user: User;
  citizien: Citizien;

  userOptions = {
    pseudo: "",
    country: "",
    uid: ""
  }

  constructor(private userService: UserService,
    public afAuth: AngularFireAuth) {

  }

  ngOnInit() {
    if(this.userService.isUserConnected()){
        this.userConnected();
        console.log("Connected");
      } else {
        this.userNotConnected();
        this.userService.emptyLocalStorage();
      }
  }

  userConnected() {
    this.getUser();
    this.userService.setLocalStorage();
  }

  userNotConnected() {
    this.userService.emptyLocalStorage();
  }

  getUser() {
    this.userService.getCitizien().subscribe((user: Citizien) => {
      this.citizien = user;
    });
  }

  login() : void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((firebaseUser) => {
      if (firebaseUser.additionalUserInfo.isNewUser) {
        this.userOptions.uid = firebaseUser.user.uid;

          this.userService.createUserInDatabase(this.userOptions).then(() => {
            this.getUser();
          });
      }
    });
  }

  loginFacebook () {
    this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()).then((firebaseUser) => {
      if (firebaseUser.additionalUserInfo.isNewUser) {
        this.userOptions.uid = firebaseUser.user.uid;

          this.userService.createUserInDatabase(this.userOptions).then(() => {
            this.getUser();
          });
      }
    });
  }


  logout() {
    this.afAuth.auth.signOut();
    this.userService.emptyLocalStorage();
  }


}
