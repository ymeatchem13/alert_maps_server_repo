import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { retry } from 'rxjs';
import { SharedService } from '../shared.service';
import { AuthService } from './auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubscribeDialogComponent } from '../subscribe-dialog/subscribe-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  loginDisplay: boolean = false;

  userName: string = "";

  userEmail: string = "";

  initials: string = "";

  constructor(public auth: AuthService, public router: Router, private service: SharedService, private dialog: MatDialog) {}

  async canActivate(): Promise<boolean> {
    if (!this.auth.isAuthenticated()) {
      let authWindow = window.open("https://sp.ucalertmaps.com/Shibboleth.sso/Login"); //, "_self");
      try {
        await this.requestSamlLogin();
        return false;
      }
      catch(err) {
        console.log(err);
      }

      window.onunload = window.onbeforeunload = (e) => {
        localStorage.setItem('loginSSO',JSON.stringify(false));
      }
    }
    return true;
  }

  requestSamlLogin() {
    this.service
      .samlLogin()
      .pipe(retry(1))
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.handleSamlLoginAuthentication(result);
            localStorage.setItem('displaySubscribe', JSON.stringify(true));
            this.router.navigate(['home']);
          }
        }
      });
  }

  handleSamlLoginAuthentication(result: any) {
    localStorage.setItem('loginSSO',JSON.stringify(true));
    localStorage.setItem('userName',JSON.stringify("Yoshua Meatchem")); //result.displayName
    localStorage.setItem('userEmail',JSON.stringify("meatchya@mail.uc.edu")); //result.emailAddress
    this.getUserInitials("Yoshua Meatchem"); //result.displayName
  }

  getUserInitials(name: string) {
    const names: string[] = name.split(' '); 
    this.initials = '';
    for (let i = 0; i < names.length; i++) {
      if (names[i].length > 0 && names[i] !== '') {
        this.initials += names[i][0];
      }
    }

    if (this.initials.length > 2) {
      const length: number = this.initials.length;
      this.initials = this.initials.substring(0,1) + this.initials.substring(length - 1);
    }

    localStorage.setItem('initials', JSON.stringify(this.initials));
  }
}
