import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-posting-publicly',
  templateUrl: './posting-publicly.component.html',
  styleUrls: ['./posting-publicly.component.scss']
})
export class PostingPubliclyComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PostingPubliclyComponent>) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
