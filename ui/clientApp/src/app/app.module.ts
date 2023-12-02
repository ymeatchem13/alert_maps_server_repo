import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertDetailsComponent } from './alert/alert-details.component';
import { SharedService } from './shared.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon'; 
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeocoderService } from './geocoder.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { AppNavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MessagingService } from './services/messaging.service';
import { MatTableModule } from '@angular/material/table';
import { OAuthModule } from 'angular-oauth2-oidc-fix';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MatListModule } from '@angular/material/list';
import { AgmCoreModule } from '@agm/core';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { PostingPubliclyComponent } from './posting-publicly/posting-publicly.component';
import { SubscribeDialogComponent } from './subscribe-dialog/subscribe-dialog.component';
import { LogoutComponent } from './logout/logout.component';

const isIE = window.navigator.userAgent.indexOf('MSIE') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    AlertDetailsComponent,
    HomeComponent,
    AlertsComponent,
    AppNavComponent,
    FooterComponent,
    AlertDialogComponent,
    PostingPubliclyComponent,
    SubscribeDialogComponent,
    LogoutComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatDialogModule,
    MatSidenavModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTableModule,
    MatListModule,
    MatTooltipModule,
    MatMenuModule,
    OAuthModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCTLKwOhZvj_JEM3a3LyVDvjEDZNO0kT8' 
    }),
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: '608bdf70-1de7-4493-b9c1-f56613aa283d',
        authority: 'https://login.microsoftonline.com/fa93bc09-d0a8-4ca9-b761-743be32ffc99',
        redirectUri: 'http://localhost:4200'
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE,
      },
      system: {
        loggerOptions: {
          loggerCallback: () => {},
          piiLoggingEnabled: false
        }
      }
    }),
    {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read']
        }
    }, 
    {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ])
    }
    )
  ],
  providers: [SharedService, GeocoderService, MessagingService, AsyncPipe, MsalGuard, {provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true}],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
