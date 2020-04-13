import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Citizien } from 'src/interfaces/Citizien.interface';
import { ToastrService } from 'ngx-toastr';
import { ActionService } from 'src/services/action.service';


import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Action } from 'src/interfaces/Action.interface';
import { Energy } from 'src/interfaces/Energy.interface';
import { EnergyService } from 'src/services/energy.service';

@Component({
  selector: 'app-eat',
  templateUrl: './eat.component.html',
  styleUrls: ['./eat.component.sass']
})
export class EatComponent implements OnInit {
  citizien: Citizien;
  actionsPossible: any = [];

  enableActions: boolean;

  constructor(private userService: UserService, 
              private actionService: ActionService,
              private energyService: EnergyService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loadCitizien().then(() => {
      this.checkIfCanEat();
      this.loadActions();
    });
  }

  checkIfCanEat() {
    if (this.isNewEatPeriod()) {
      this.enableActions = true;
    } else {
      this.enableActions = false;
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

  eat(action : Action) {
    if (this.energyService.hasEnoughEnergy()) {
      this.userService.applyEffectsFromAction(action, this.citizien).then(() => {
        this.energyService.decrementEnergy();
        this.openSnackbar("Success : " + action.name);
      });
    } else {
      this.openSnackbar("Please wait for energy to refill.")
    }
  }

  isNewEatPeriod() {
    let lastPeriodEaten: number = this.citizien.lastEatenPeriod;
    let currentEatPeriod: number = this.userService.convertTimeToPeriod();

    return currentEatPeriod !== lastPeriodEaten
  }

  loadActions() {
    this.actionService.getActionsList('food', this.citizien).then((actions) => {
      this.actionsPossible = actions;
    });
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
