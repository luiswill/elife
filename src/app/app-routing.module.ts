import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DailyActionsComponent } from './daily-actions/daily-actions.component';
import { EatComponent } from './eat/eat.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [
  { path: 'user', component: UserProfileComponent },
  { path: 'actions/daily', component: DailyActionsComponent },
  { path: 'actions/eat', component: EatComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
