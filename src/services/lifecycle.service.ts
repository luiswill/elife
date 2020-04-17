import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Subject, Observable } from 'rxjs';
import { EnergyService } from './energy.service';

@Injectable({
  providedIn: 'root'
})
export class LifecycleService {

  timer;
  oneLifecycleDurationInMilliseconds: number = 5000;
  
  public isLifecycleStopped : boolean = false;


  private lifecycle: Subject<boolean> = new Subject<boolean>();
  lifecycleObs: Observable<boolean> = this.lifecycle.asObservable();

  constructor() {
    this.startLifecycle();
  }

  getLifecycle(): Observable<boolean> {
    return this.lifecycleObs;
  }

  stopLifecycle() : void {
    clearInterval(this.timer);
    this.isLifecycleStopped = true;
  }

  startLifecycle(): void {
    this.isLifecycleStopped = false;
    this.timer = setInterval(() => {
      
    this.lifecycle.next(true);

    }, this.oneLifecycleDurationInMilliseconds);
  }
}
