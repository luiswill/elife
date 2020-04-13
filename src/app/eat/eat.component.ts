import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Citizien } from 'src/interfaces/Citizien.interface';
import { ToastrService } from 'ngx-toastr';
import { ActionService } from 'src/services/action.service';

@Component({
  selector: 'app-eat',
  templateUrl: './eat.component.html',
  styleUrls: ['./eat.component.sass']
})
export class EatComponent implements OnInit {
  citizien: Citizien;
  actionsPossible: any = [];

  enableActions: boolean;

  constructor(private userService: UserService, private toastr: ToastrService, private actionService: ActionService) { }

  ngOnInit() {
    // this.loadCitizien().then(() => {
    //   this.checkIfCanEat();
    //   this.loadActions();
    // });
  }

  checkIfCanEat() {
    if (this.isNewEatPeriod()) {
      this.enableActions = true;
      this.userService.setPropertyOfCitizien(this.citizien.uid, 'hasEaten', false);
    } else {
      this.enableActions = false;
    }
  }



  loadCitizien() {
    // return new Promise((resolve) => {
    //   this.userService.getCitizien().subscribe((citizien: Citizien) => {
    //     this.citizien = citizien;
    //     resolve();
    //   });
    // });
  }

  eat(arrayIndex) {
    if (this.citizien.hasEaten) {
      if (this.isNewEatPeriod()) {

      } else {
        this.toastr.warning("You have already eaten, come back during another time period.", "Eat");
      }
    } else {
      this.userService.applyEffectsFromAction(this.actionsPossible[arrayIndex], this.citizien, 'eat').then(() => {
        this.toastr.success("You have eaten.", "Eat");
        this.enableActions = false;
      });
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


}
