import { Component, Inject, OnInit } from '@angular/core';
import { MsalService, MsalBroadcastService, MsalGuardConfiguration, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, PopupRequest } from '@azure/msal-browser';
import { Subject, retry } from 'rxjs';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'
]
})
export class AppNavComponent implements OnInit {

  isIframe: boolean = false;

  userName: string = "";

  userEmail: string = "";

  initials: string = "";

  userImage: any;

  userInitials: any;

  collapsed: boolean = true;

  authRequested: boolean;

  private readonly _destroying$ = new Subject<void>();

  navMenus = [
    {"url":"/home", "text":"Home", "active": false},
    {"url":"/alerts", "text":"Alerts", "active": false},
  ];

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private service: SharedService, private authService: MsalService, public router: Router) {
    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler') as HTMLElement;
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.checkLocalStorage();
  }

  login() {
    window.open("https://sp.ucalertmaps.com/Shibboleth.sso/Login"); //, "_self");
    this.router.navigate(['home']);
  }

  logout() {
    this.router.navigate(['logout']);
  }

  // login() {
  //   if (this.msalGuardConfig.authRequest){
  //     this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
  //       .subscribe({
  //         next: (result) => {
  //           console.log(result);
  //           this.setLoginDisplay(result);
  //         },
  //         error: (error) => console.log(error)
  //       });
  //   } else {
  //     this.authService.loginPopup()
  //       .subscribe({
  //         next: (result) => {
  //           console.log(result);
  //           this.setLoginDisplay(result);
  //         },
  //         error: (error) => console.log(error)
  //       });
  //   }
  // }

  // logout() {
  //   this.authService.logoutPopup({
  //     mainWindowRedirectUri: "/"
  //   });

  //   localStorage.setItem('userName', JSON.stringify(null));
  //   localStorage.setItem('userEmail', JSON.stringify(null));
  //   localStorage.setItem('initials', JSON.stringify(null));
  // }

  // setLoginDisplay(result?: AuthenticationResult) {
  //   this.loginDisplay = (result?.account?.localAccountId != "" && result?.account?.localAccountId != undefined) ? true : false;
  //   if (this.loginDisplay) {
  //     this.userName = result.account.name;
  //     this.userEmail = result.account.username;

  //     localStorage.setItem('userName', JSON.stringify(result.account.name));
  //     localStorage.setItem('userEmail', JSON.stringify(result.account.username));
  //     this.getUserInitials(result.account.name);
  //   }
  // }

  // getUserInitials(name: string) {
  //   const names: string[] = name.split(' '); 
  //   this.initials = '';
  //   for (let i = 0; i < names.length; i++) {
  //     if (names[i].length > 0 && names[i] !== '') {
  //       this.initials += names[i][0];
  //     }
  //   }

  //   if (this.initials.length > 2) {
  //     const length: number = this.initials.length;
  //     this.initials = this.initials.substring(0,1) + this.initials.substring(length - 1);
  //   }

  //   localStorage.setItem('initials', JSON.stringify(this.initials));
  // }

  checkLocalStorage() {
    const userName = JSON.parse(localStorage.getItem('userName'));
    const userEmail = JSON.parse(localStorage.getItem('userEmail'));
    const initials = JSON.parse(localStorage.getItem('initials'));

    this.userName = userName != null ? userName : "";
    this.userEmail = userEmail != null ? userEmail : "";
    this.initials = initials != null ? initials : "";

    // if (userName != null) {
    //   this.loginDisplay = true;
    //   this.getUserInitials(this.userName);
    // } else {
    //   this.login();
    // }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  toggleMenu() {
    let subMenu = document.getElementById("subMenu");
    subMenu.classList.toggle("open-menu");
  }

  onMenuCollapsed() {
    this.collapsed = !this.collapsed;
  }
}
