import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalStorageService } from 'angular-web-storage';

import { Citizien } from '../interfaces/Citizien.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  newCitizien: Citizien = {
    age: 0,
    country: "",
    hungry: 100,
    health: 100,
    money: 0,
    pseudo: "",
    uid: "",
    fitness: 100,
    honesty: 100,
    kindness: 100,
    lovingness: 100,
    socialness: 100,
    dailyActionsAvailable: 2,
    dailyActionsTotal: 2,
    dailyActionsLastDay: 0,
    hasEaten: false,
    lastEatenPeriod: 0
  }

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth, public local: LocalStorageService) {
  }

  applyEffectsFromAction(action, citizien: Citizien) {
    let userId = this.local.get('userFirebaseId');

    let updatedCitizien = citizien;


    for (let characteristics in action.effects) {
      updatedCitizien[characteristics] += action.effects[characteristics];
    }

    // Remove on daily action
    updatedCitizien['dailyActionsAvailable']--;

    if (updatedCitizien['dailyActionsAvailable'] >= 0) {
      this.afs.collection('users').doc(userId).update(updatedCitizien);
    } else {
      console.log('User.service.ts : applyEffectsFromAction : Come back tomorrow');
    }
  }

  getTodaysDateNumber() {
    let date = new Date();
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
  }

  isNewDay(citizien: Citizien) {
    let dateToday = this.getTodaysDateNumber();

    return citizien.dailyActionsLastDay != dateToday;
  }

  getUserFromFirebase() {
    return this.afAuth.user;
  }

  getUserId() {
    return new Promise((resolve, reject) => {
      this.getUserFromFirebase().subscribe((user) => {
        resolve(user.uid);
      })
    });
  }


  getCitizien() {
    var userId = this.local.get('userFirebaseId');
    return this.afs.collection('users').doc(userId).valueChanges();
  }

  createUserInDatabase(userOptions) {
    this.emptyLocalStorage();
    this.newCitizien.uid = userOptions.uid
    this.newCitizien.pseudo = userOptions.pseudo
    this.newCitizien.country = userOptions.country

    this.local.set('userFirebaseId', userOptions.uid);
    this.afs.collection('users').doc(userOptions.uid).set(this.newCitizien);
  }

  emptyLocalStorage() {
    console.log('Emptied local storage');
    this.local.remove('userFirebaseId');
  }

  resetDailyActions(uid: string, actionsToFill) {
    this.afs.collection('users').doc(uid).update({
      dailyActionsAvailable: actionsToFill,
      dailyActionsLastDay: this.getTodaysDateNumber()
    });
  }
}
