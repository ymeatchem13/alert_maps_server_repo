import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc-fix';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '449861348715-llj52v19nbvp7ursmic78p2klfs9sbnj.apps.googleusercontent.com',
  scope: 'openid profile email'
}

export interface UserInfo {
  info: {
    sub: string,
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {

  userProfileSubject = new Subject<UserInfo>();

  constructor(private readonly oAuthService: OAuthService) { 
    oAuthService.configure(oAuthConfig);
    oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';
    oAuthService.loadDiscoveryDocument().then(() => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if(!oAuthService.hasValidAccessToken()) {
          oAuthService.initLoginFlow()
        } else {
          oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo);
          })
        }
      })
    })
  }

  public isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  public signout() {
    this.oAuthService.logOut()
  }
}
