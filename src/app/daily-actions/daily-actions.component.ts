import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Citizien } from 'src/interfaces/Citizien.interface';
import { ActionService } from 'src/services/action.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnergyService } from 'src/services/energy.service';
import { Action } from 'src/interfaces/Action.interface';
import { Energy } from '../../interfaces/Energy.interface';
import { Observable } from 'rxjs';

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
    private snackBar: MatSnackBar,
    private energyService: EnergyService) {

  }

  ngOnInit() {
    this.loadCitizien().then(() => {
      console.log('citizien : ', this.citizien);
      this.loadActions();
      this.checkDailyActionsAmount();
    });


    console.log("Day today : " + this.getDayOfYear());
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
    this.actionService.getActionsList('daily-actions', this.citizien).then((actions) => {
      this.actionsPossible = actions;
    });
  }

  runDailyAction(action : Action) {
    if (this.energyService.hasEnoughEnergy()) {
      this.userService.applyEffectsFromAction(action, this.citizien, 'daily-actions').then(() => {
        this.energyService.decrementEnergy();
        this.openSnackbar("Success : " + action.name);
      });
    } else {
      this.openSnackbar("Please wait for energy to refill.")
    }
  }

  getDayOfYear() {
    var date = new Date();
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
  }


  openSnackbar(text : String) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 2000,
      data: {
        html: '<p class="mat-body">' + text + '</p>'
      }
    });
  }
}
