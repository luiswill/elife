import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalStorageService } from 'angular-web-storage';


import { Citizien } from '../interfaces/Citizien.interface';
import { firestore } from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { Age } from 'src/interfaces/Age.interface';
import { resolve } from 'dns';
import { Action } from 'src/interfaces/Action.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  newCitizien: Citizien = {
    age: {months: 0, years: 0},
    country: "",
    money: 0,
    pseudo: "",
    uid: "",
    characteristics: {
      fitness: 50,
      creativity: 50,
      intelligence: 50,
      honesty: 50,
      kindness: 50,
      love: 50,
      social: 50,
      hungry: 100,
      health: 100,
    },
    hasEaten: false,
    lastEatenPeriod: 0
  }

  userConnected : BehaviorSubject<Citizien> = new BehaviorSubject<Citizien>(this.newCitizien);
  citizien: Citizien;

  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public local: LocalStorageService) {

      this.getCitizien().subscribe((citizien: Citizien) => {
        this.citizien = citizien;
      });
      
  }

  applyEffectsFromAction(action: Action, citizien: Citizien) {
    return new Promise((resolve, reject) => {

      console.log("Action to apply ", action);
      
      let updatedCitizien = citizien;

      for (let [charactersticName, characteristicValue] of Object.entries(action.effects)) {
        updatedCitizien.characteristics[charactersticName] += characteristicValue;
      }

      console.log("Updated citizien : ", updatedCitizien);

      this.updateCitizien(updatedCitizien).then(() => {
        resolve()
      });
    });
  }

  updateCitizien(updatedCitizien: Citizien) : Promise<void>{
    return new Promise((resolve, reject) => {
      this.getUserId().then((userId: string) => {
          return this.afs.collection('users').doc(userId).update(updatedCitizien).then(() => {
            resolve();
          }).catch((error) => {
            reject();
            console.log('Error while updating citizien', error);
          });;
      });
    });
  }

  incrementAge(months: number) {
    let updatedCitizien = this.citizien;
    updatedCitizien.age.months += months;

    if(updatedCitizien.age.months == 13) {
      updatedCitizien.age.months = 0;
      updatedCitizien.age.years++;
    }

    console.log("Incremeting age..");
    

    this.updateCitizien(updatedCitizien);
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

  citizienEat(citizien: Citizien, action: Action) {
    return new Promise((resolve) => {

      let updatedCitizien = citizien;

      updatedCitizien.hasEaten = true;

      this.applyEffectsFromAction(action, citizien);
    });
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
    console.log("user id ", userId);
    
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
          requirementsRespected.push(citizien.characteristics[requirement.propertyName] > requirement.value)
        } else if (requirement.operand === '<') {
          requirementsRespected.push(citizien.characteristics[requirement.propertyName] < requirement.value)
        } else if (requirement.operand === '==') {
          requirementsRespected.push(citizien.characteristics[requirement.propertyName] == requirement.value)
        }
      });

      return requirementsRespected.every(this.isTrue);
    } else {
      return true;
    }
  }
}
