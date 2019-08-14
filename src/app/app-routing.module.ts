import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DailyActionsComponent } from './daily-actions/daily-actions.component';
import { EatComponent } from './eat/eat.component';


const routes: Routes = [
  { path: 'user', component: UserProfileComponent },
  { path: 'actions/daily', component: DailyActionsComponent },
  { path: 'actions/eat', component: EatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
