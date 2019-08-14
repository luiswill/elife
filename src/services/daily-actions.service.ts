import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DailyActionsService {

  constructor(private afs: AngularFirestore, private userService: UserService) {

  }

  getDailyAction(id) {
    return this.afs.collection('daily-actions').doc(id.toString());
  }

  getDailyActionsList(citizienAge) {
    return this.afs.collection('daily-actions').ref.where("age", ">=", citizienAge).get();
  }

  runDailyAction(action, citizien) {
    this.userService.applyEffectsFromAction(action, citizien);
  }
}
