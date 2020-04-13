import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

// Services
import { UserService } from 'src/services/user.service';
import { GameSettingsService } from 'src/services/game-settings.service';
import { User } from 'firebase';

//Interfaces
import { Country } from '../../interfaces/Country.interface';
import { Citizien } from '../../interfaces/Citizien.interface';
import { AngularFirestoreCollection } from '@angular/fire/firestore';


// Dialog 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogUsernameInputComponent } from '../dialogs/dialog-username-input/dialog-username-input.component';
import { DialogUserRegistrationData } from 'src/interfaces/DialogUserRegistrationData';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})

export class UserProfileComponent implements OnInit {
  user: User;
  citizien: Citizien;

  private countriesCollection: AngularFirestoreCollection<Country>;
  countries: Observable<Country[]>;

  userOptions = {
    pseudo: "",
    country: "",
    uid: ""
  }


  constructor(private userService: UserService,
    public afAuth: AngularFireAuth,
    private gameSettingsService: GameSettingsService,
    private dialog: MatDialog) {
  }


  ngOnInit() {

    this.afAuth.user.subscribe((user) => {

      console.log("afAuth : ", user);
      
      // if connected
      if (user) {
        this.userConnected();
      } else {
        this.userNotConnected();
      }
    });
  }

  userConnected() {
    this.getUser();
  }

  userNotConnected() {
    this.countriesCollection = this.gameSettingsService.getCountries();
    this.countries = this.countriesCollection.valueChanges();
  }

  getUser() {
    this.userService.getCitizien().subscribe((user: Citizien) => {
      console.log("User profile - user :", user);
      this.citizien = user;
    });
  }

  login() : void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((firebaseUser) => {
      if (firebaseUser.additionalUserInfo.isNewUser) {
        this.userOptions.uid = firebaseUser.user.uid;
        console.log('user', this.userOptions);
        
        this.askForAnUsername().afterClosed().subscribe((data : DialogUserRegistrationData) => {

          this.userOptions.pseudo = data.username;
          this.userOptions.country = data.country;

          this.userService.createUserInDatabase(this.userOptions);
        })
        
      }
    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  askForAnUsername(): MatDialogRef<DialogUsernameInputComponent> {
    return this.dialog.open(DialogUsernameInputComponent, {
      width: '250px',
      data: {}
    });
  }


  countrySelection(country) {
    this.userOptions.country = country
  }

}
