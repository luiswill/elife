import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

//Interfaces
import { Country } from '../interfaces/Country.interface'

@Injectable({
  providedIn: 'root'
})
export class GameSettingsService {

  constructor(private afs: AngularFirestore) {

  }

  getCountries() {
    return this.afs.collection<Country>('countries');
  }

}
