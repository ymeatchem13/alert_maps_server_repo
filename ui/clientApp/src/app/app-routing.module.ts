import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlertDetailsComponent } from './alert/alert-details.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AuthGuard } from './services/auth.guard';
import { BrowserUtils } from '@azure/msal-browser/dist/utils/BrowserUtils';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: '', redirectTo: "home", pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'logout', component: LogoutComponent},
  { path: 'alert-details', component: AlertDetailsComponent, canActivate: [AuthGuard]},
  { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard]},
  { path: '**', component: HomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
