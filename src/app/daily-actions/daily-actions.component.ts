import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Citizien } from 'src/interfaces/Citizien.interface';
import { ActionService } from 'src/services/action.service';
import { ToastrService } from 'ngx-toastr';


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
    private actionService: ActionService,
    private toastr: ToastrService) {

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
        this.toastr.warning("No more daily actions, come back tomorrow.", "Daily actions");
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
    this.actionService.getActionsList('daily-actions', this.citizien).then((actions) => {
      this.actionsPossible = actions;
    });
  }

  runDailyAction(arrayIndex) {
    if (this.citizien.dailyActionsAvailable === 0) {
      this.enableActions = false;
    } else {
      this.userService.applyEffectsFromAction(this.actionsPossible[arrayIndex], this.citizien, 'daily-actions').then(() => {
        this.toastr.success("Success", "Daily action");
      });
    }
  }
}
