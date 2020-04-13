import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Citizien } from 'src/interfaces/Citizien.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private afs: AngularFirestore, private userService: UserService) { }

  filterActions(actionDirectory: string, citizien: Citizien) {
    return new Promise((resolve) => {
      let actionsFiltered = [];

      this.afs.collection(actionDirectory).ref.where("ageAvailable", "<=", citizien.age.years).get().then((actionsData) => {
        actionsData.forEach((action) => {
          if (this.userService.isCitizienRespectingCharacteristicRequirements(citizien, action.data().conditions)) {
            actionsFiltered.push(action.data());
          }
        })

        // all filtered
        resolve(actionsFiltered);
      }).catch((error) => {
        console.log('Error', error);
      });
    })

  }

  getActionsList(actionDirectory: string, citizien: Citizien) {
    return new Promise((resolve) => {
      this.filterActions(actionDirectory, citizien).then((actionsFiltered) => {
        resolve(actionsFiltered);
      });
    })

  }

  getAction(actionDirectory: string, id: string) {
    return this.afs.collection(actionDirectory).doc(id.toString());
  }

}
