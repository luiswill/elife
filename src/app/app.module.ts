import { NgModule } from '@angular/core';

import { AngularWebStorageModule } from 'angular-web-storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { EatComponent } from './eat/eat.component';
import { DailyActionsComponent } from './daily-actions/daily-actions.component'


import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';


// Material modules 
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';




@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    DailyActionsComponent,
    EatComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularWebStorageModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
    AngularFireModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features.initializeApp(environment.firebase),
    AppRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
