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

  removeHungryFromAction: number = 10;

  actionsPossible: any = [];

  constructor(private userService: UserService,
    private actionService: ActionService,
    private snackBar: MatSnackBar,
    private energyService: EnergyService,) {

  }

  ngOnInit() {
    if(this.userService.isUserConnected()) {
      this.loadCitizien().then(() => {
        this.loadActions();
      });
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
      let updatedCitizien = this.citizien;
      updatedCitizien.characteristics.hungry -= this.removeHungryFromAction;

      this.userService.applyEffectsFromAction(action, updatedCitizien).then(() => {
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
