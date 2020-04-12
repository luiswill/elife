import { Component, OnInit, Input } from '@angular/core';
import { LifecycleService } from 'src/services/lifecycle.service';
import { EnergyService } from 'src/services/energy.service';
import { Energy } from 'src/interfaces/Energy.interface';
import { $ } from 'protractor';

@Component({
  selector: 'app-lifecycle',
  templateUrl: './lifecycle.component.html',
  styleUrls: ['./lifecycle.component.sass']
})
export class LifecycleComponent implements OnInit {
  timer;
  isTimerRunning = false;

  public percentage: number = 100;
  public stopTimer: boolean;


  constructor(private lifecycleService: LifecycleService,
    private energyService: EnergyService) { }

  ngOnInit(): void {

    this.energyService.getEnergy().subscribe((energy) => {
      if(this.lifeCycleCanBeFilledAgain(energy)) {
        this.lifecycleService.startLifecycle();
        this.decrementToolbar();
      }
    });

    this.lifecycleService.getLifecycle().subscribe(() => {
      if(!this.isTimerRunning) {
        this.decrementToolbar();
        this.isTimerRunning = true;
      }
    });
  }

  stopDecrementingToolbar() : void {
    clearInterval(this.timer);
  }


  lifeCycleCanBeFilledAgain(energy: Energy) : boolean {
    let lastElementIndex = energy.energyBar.length - 1;

    return this.lifecycleService.isLifecycleStopped && energy.currentEnergyBarIndex == lastElementIndex;
  }

  decrementToolbar(): void {
    this.timer = setInterval(() => {
      this.percentage--;

      if(this.percentage == 0) {
        this.percentage = 100;
        this.energyService.incrementEnergy();

        if(this.energyService.isEnergyBarIsFull()) {
          this.stopDecrementingToolbar();
        }
      }

    }, (this.lifecycleService.oneLifecycleDurationInMilliseconds / 100));
  }

}
