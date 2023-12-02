import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    //window.open("https://sp.ucalertmaps.com/Shibboleth.sso/Logout"); //, "_self");
    this.dialog.closeAll();
    localStorage.clear();
  }

}
