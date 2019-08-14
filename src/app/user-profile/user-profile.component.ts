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


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
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
    private gameSettingsService: GameSettingsService) {
  }


  ngOnInit() {

    this.afAuth.user.subscribe((user) => {
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
    this.countriesCollection = this.gameSettingsService.getCountries();;
    this.countries = this.countriesCollection.valueChanges();
  }

  getUser() {
    this.userService.getCitizien().subscribe((user: Citizien) => {
      console.log("user :", user);
      this.citizien = user;
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((firebaseUser) => {
      if (firebaseUser.additionalUserInfo.isNewUser) {
        this.userOptions.uid = firebaseUser.user.uid;
        console.log('user', this.userOptions);
        this.userService.createUserInDatabase(this.userOptions);
      }
    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }


  countrySelection(country) {
    this.userOptions.country = country
  }

}
