import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Citizien } from 'src/interfaces/Citizien.interface';
import { Energy } from 'src/interfaces/Energy.interface';
import { EnergyService } from '../../services/energy.service';
import { Observable } from 'rxjs';
import { LifecycleService } from 'src/services/lifecycle.service';

@Component({
  selector: 'app-charateristics-dashboard',
  templateUrl: './charateristics-dashboard.component.html',
  styleUrls: ['./charateristics-dashboard.component.sass']
})
export class CharateristicsDashboardComponent implements OnInit {
  animate : boolean;
  citizien : Citizien;
  mEnergy : Observable<Energy>;
  
  constructor(private userService: UserService,
              public energyService: EnergyService,
              private lifecycleService: LifecycleService) { }

  ngOnInit(): void {
    this.getUser();
    this.animateProgressBar();
  }

  getUser() {
    this.userService.getCitizien().subscribe((user: Citizien) => {
      console.log("Characteristics Dashboard", user);
      this.citizien = user;
    });
  }

  get energyObs(): Observable<Energy> {
    return this.energyService.getEnergy();
  }

  animateProgressBar() : void {
    this.mEnergy = this.energyService.getEnergy();
  }
}
