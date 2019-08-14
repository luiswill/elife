import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Citizien } from 'src/interfaces/Citizien.interface';
import { DailyActionsService } from 'src/services/daily-actions.service';

@Component({
  selector: 'app-daily-actions',
  templateUrl: './daily-actions.component.html',
  styleUrls: ['./daily-actions.component.sass']
})
export class DailyActionsComponent implements OnInit {

  citizien: Citizien;
  enableActions: boolean = true;

  actionsPossible: any = [];

  constructor(private userService: UserService,
    private dailyActionsService: DailyActionsService) {

  }

  ngOnInit() {
    this.loadCitizien().then(() => {
      console.log('citizien : ', this.citizien);
      this.loadActions();
      this.checkDailyActionsAmount();
    });
  }

  checkDailyActionsAmount() {
    if (this.citizien.dailyActionsAvailable === 0) {
      // If it's a new day, reset daily actions
      if (this.userService.isNewDay(this.citizien)) {
        this.userService.resetDailyActions(this.citizien.uid, this.citizien.dailyActionsTotal);
      } else {
        this.enableActions = false;
      }
    }
  }

  loadCitizien() {
    return new Promise((resolve) => {
      this.userService.getCitizien().subscribe((citizien: Citizien) => {
        this.citizien = citizien;
        resolve();
      });
    });
  }

  loadActions() {
    this.dailyActionsService.getDailyActionsList(this.citizien.age).then((actionsData) => {
      actionsData.forEach((action) => {
        this.actionsPossible.push(action.data());
      })
    }).catch((error) => {
      console.log('Error', error);
    });
  }


  runDailyAction(arrayIndex) {
    if (this.citizien.dailyActionsAvailable === 0) {
      this.enableActions = false;
    } else {
      this.dailyActionsService.runDailyAction(this.actionsPossible[arrayIndex], this.citizien);
    }
  }
}
