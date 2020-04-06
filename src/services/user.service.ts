import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalStorageService } from 'angular-web-storage';


import { Citizien } from '../interfaces/Citizien.interface';
import { firestore } from 'firebase';


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
    cookingSkills: 100,
    intelligence: 100,
    honesty: 100,
    kindness: 100,
    love: 100,
    social: 100,
    dailyActionsAvailable: 2,
    dailyActionsTotal: 2,
    dailyActionsLastDay: 0,
    hasEaten: false,
    lastEatenPeriod: 0
  }

  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public local: LocalStorageService) {
  }

  applyEffectsFromAction(action, citizien: Citizien, actionName: string) {
    return new Promise((resolve, reject) => {
      let userId = citizien.uid

      let updatedCitizien = citizien;

      for (let characteristics in action.effects) {
        updatedCitizien[characteristics] += action.effects[characteristics];
      }

      if (actionName === 'daily-actions') {
        updatedCitizien['dailyActionsAvailable']--;
      }
      if (actionName === 'eat') {
        updatedCitizien['hasEaten'] = true;
        updatedCitizien['lastEatenPeriod'] = this.convertTimeToPeriod()
      }

      this.afs.collection('users').doc(userId).update(updatedCitizien).then(() => {
        resolve();
      }).catch((error) => {
        reject();
        console.log('Error', error);
      });
    });
  }


  changePropertyOfCitizien(uid: string, propertyName: string, change) {
    return new Promise((resolve) => {
      const newValue = firestore.FieldValue.increment(change);

      let key = propertyName;
      let updatedProperty = {};
      updatedProperty[key] = newValue;

      this.afs.collection('users').doc(uid).update(updatedProperty).then(() => {
        resolve();
      }).catch((error) => {
        console.log('Error while changing property : ', error);
      });
    });
  }

  convertTimeToPeriod(): number {
    let time = new Date().getUTCHours();
    let period = 0;

    if (time <= 8) {
      period = 1;
    } else if (time > 8 && time <= 16) {
      period = 2;
    } else {
      period = 3;
    }
    return period;
  }

  citizienEat(uid: string, change: number) {
    return new Promise((resolve) => {
      const newValue = firestore.FieldValue.increment(change);


      let updatedProperty = {};
      updatedProperty['hungry'] = newValue;
      updatedProperty['hasEaten'] = true;

      this.afs.collection('users').doc(uid).update(updatedProperty).then(() => {
        resolve();
      }).catch((error) => {
        console.log('Error while changing property : ', error);
      });
    });
  }

  setPropertyOfCitizien(uid: string, propertyName: string, newValue: any) {
    return new Promise((resolve) => {

      let key = propertyName;
      let updatedProperty = {};
      updatedProperty[key] = newValue;

      this.afs.collection('users').doc(uid).update(updatedProperty).then(() => {
        resolve();
      });
    });
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


  isTrue(element) {
    return element;
  }

  isCitizienRespectingCharacteristicRequirements(citizien: Citizien, requirements: any[]) {


    if (requirements) {
      let requirementsRespected: boolean[] = []
      requirements.forEach((requirement) => {
        if (requirement.operand === '>') {
          requirementsRespected.push(citizien[requirement.propertyName] > requirement.value)
        } else if (requirement.operand === '<') {
          requirementsRespected.push(citizien[requirement.propertyName] < requirement.value)
        } else if (requirement.operand === '==') {
          requirementsRespected.push(citizien[requirement.propertyName] == requirement.value)
        }
      });

      return requirementsRespected.every(this.isTrue);
    } else {
      return true;
    }
  }


  resetDailyActions(uid: string, actionsToFill) {
    this.afs.collection('users').doc(uid).update({
      dailyActionsAvailable: actionsToFill,
      dailyActionsLastDay: this.getTodaysDateNumber()
    });
  }
}
