import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EnergyService } from 'src/services/energy.service';
import { Energy } from '../../interfaces/Energy.interface';

@Component({
  selector: 'app-energy-bar',
  templateUrl: './energy-bar.component.html',
  styleUrls: ['./energy-bar.component.sass']
})
export class EnergyBarComponent implements OnInit {


  constructor(private energyService: EnergyService) { }

  ngOnInit(): void {
  }

  get energyObs(): Observable<Energy> {
    return this.energyService.getEnergy();
  }
}
