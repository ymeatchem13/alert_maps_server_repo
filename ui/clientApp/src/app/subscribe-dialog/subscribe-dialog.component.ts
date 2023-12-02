import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../shared.service';
import { retry } from 'rxjs';

@Component({
  selector: 'app-subscribe-dialog',
  templateUrl: './subscribe-dialog.component.html',
  styleUrls: ['./subscribe-dialog.component.scss']
})
export class SubscribeDialogComponent implements OnInit {

  emailAddress: string = "";

  constructor(private dialogRef: MatDialogRef<SubscribeDialogComponent>, private service: SharedService) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (this.emailAddress != "") {

      var emailMessage = {
        From: this.emailAddress,
        To: this.emailAddress,
        Content: "",
        Subject: ""
      }

      this.service
        .subscribeEmail(emailMessage)
        .pipe(retry(1))
        .subscribe({
          next: (result: any) => {
            if (result == "Added Successfully") {
              this.closeDialog();
            }
          }
        })
    }
  }
}
