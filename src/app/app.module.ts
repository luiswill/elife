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
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { DialogUsernameInputComponent } from './dialogs/dialog-username-input/dialog-username-input.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { CharateristicsDashboardComponent } from './charateristics-dashboard/charateristics-dashboard.component';
import { LifecycleComponent } from './lifecycle/lifecycle.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { EnergyBarComponent } from './energy-bar/energy-bar.component';




@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    DailyActionsComponent,
    EatComponent,
    DialogUsernameInputComponent,
    SnackbarComponent,
    CharateristicsDashboardComponent,
    LifecycleComponent,
    UserDashboardComponent,
    EnergyBarComponent
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
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatToolbarModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
