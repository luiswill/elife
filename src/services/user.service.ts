import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalStorageService } from 'angular-web-storage';


import { Citizien } from '../interfaces/Citizien.interface';
import { firestore } from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { Age } from 'src/interfaces/Age.interface';
import { resolve } from 'dns';


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
      fitness: 100,
      creativity: 100,
      intelligence: 100,
      honesty: 100,
      kindness: 100,
      love: 100,
      social: 100,
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

  applyEffectsFromAction(action, citizien: Citizien, actionName: string) {
    return new Promise((resolve, reject) => {
      let userId = citizien.uid

      console.log("Applying effects from action ", action);
      
      let updatedCitizien = citizien;

      for (let characteristics in action.effects) {
        updatedCitizien[characteristics] += action.effects[characteristics];
      }


      if (actionName === 'eat') {
        updatedCitizien['hasEaten'] = true;
        updatedCitizien['lastEatenPeriod'] = this.convertTimeToPeriod()
      }

      this.afs.collection('users').doc(userId).update(updatedCitizien).then(() => {
        console.log("UPDATED FROM ACTION");
        
        resolve();
      }).catch((error) => {
        reject();
        console.log('Error', error);
      });
    });
  }

  updateCitizien(updatedCitizien: Citizien) : Promise<void>{
    console.log("Citiizen to update ", updatedCitizien);
    
    return new Promise((resolve, reject) => {
      this.getUserId().then((userId: string) => {
        console.log("User id ", userId);

          return this.afs.collection('users').doc(userId).update(updatedCitizien).then(() => {
            console.log("Updated citizien.");
            
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
