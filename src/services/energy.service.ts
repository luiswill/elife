import { Injectable } from '@angular/core';
import { Energy } from 'src/interfaces/Energy.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LifecycleService } from './lifecycle.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {

  private startingEnergy = {
    energyBar : [false, false, false, false],
    currentEnergyBarIndex : 0
  };

  private mEnergy = new BehaviorSubject<Energy>(this.startingEnergy);


  constructor(private lifecycleService : LifecycleService,
              private userService: UserService) { 

  }

  isEnergyBarIsFull() : boolean {
    let latestElementIndex = this.mEnergy.getValue().energyBar.length - 1;
    return this.mEnergy.getValue().energyBar[latestElementIndex];
  }


  hasEnoughEnergy() : boolean {
    return this.mEnergy.getValue().energyBar[0];
  }
  
  decrementEnergy() : void {
    let newObject =  this.mEnergy.getValue();
    newObject.currentEnergyBarIndex--;
    newObject.energyBar[newObject.currentEnergyBarIndex] = false;


    this.mEnergy.next(newObject);
  }

  incrementEnergy() : void {
    let newObject =  this.mEnergy.getValue();
    newObject.energyBar[newObject.currentEnergyBarIndex] = true;
    newObject.currentEnergyBarIndex++;

    this.mEnergy.next(newObject);

    this.userService.incrementAge(1);

    if(this.isEnergyBarIsFull()) {
      this.lifecycleService.stopLifecycle();
    }
  }

  getEnergy() : Observable<Energy> {
    return this.mEnergy.asObservable();
  }

 
}


