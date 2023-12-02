import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor() {
    }

    public isAuthenticated(): boolean {
      const loggedIn = JSON.parse(localStorage.getItem('loginSSO'));
      return loggedIn == true ? true : false;
    }
}
