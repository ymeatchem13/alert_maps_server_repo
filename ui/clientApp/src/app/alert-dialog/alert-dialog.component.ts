import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { retry } from 'rxjs';
import { SharedService } from '../shared.service';
import { AgmMap } from '@agm/core';
import { PostingPubliclyComponent } from '../posting-publicly/posting-publicly.component';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  @ViewChild(AgmMap) map!: AgmMap;

  center: any;

  userName: string = "";

  userInitials: string = "";

  data: any;

  comment: string = "";

  editedComment: string = "";

  filteredCommentList: Array<any>; 

  descriptions: Array<string> = [];

  columnsToDisplay = ['updates'];

  displayMainView: boolean = true;

  displayUpdatesView: boolean = false;

  displayCommentsView: boolean = false;

  displayAddCommentsView: boolean = false;

  constructor(private dialog: MatDialog, private service: SharedService) { }

  async ngOnInit(): Promise<void> {
    this.data = JSON.parse(localStorage.getItem('session'));
    this.userName = JSON.parse(localStorage.getItem('userName'));
    this.userInitials = this.getUserInitials(this.userName);
    this.createDescriptions();
    this.filterCommentsList(this.data.alertID);
    this.center = { lat: this.data.longitude, lng: this.data.longitude };
  }
  
  createDescriptions() {
    // Uppercase first letter of title
    this.data.title = this.data.title.charAt(0).toUpperCase() + this.data.title.slice(1);

    //  Create Descriptions list
    //const firstWord = this.data.description.split(' ').slice(0, 1);
    const descriptions: Array<string> = this.data.description.split(/(?=UC)/g);
    if (descriptions && descriptions.length > 0) {
      descriptions.forEach((d) => {
        this.descriptions.push(d);
      });
    }
  }

  filterCommentsList(alertID: number) {
    const commentList: Array<any> = JSON.parse(localStorage.getItem('commentList'));
    this.filteredCommentList = commentList.filter(c => c.alert_id == alertID);
    this.filteredCommentList.forEach(f => {
      f.initials = this.getUserInitials(f.user_name);
    })
    this.updateCommentPermissions();
  }

  getUserInitials(name: string): string {
    let initials = '';

    if (name != undefined) {
      const names: string[] = name.split(' '); 
      
      for (let i = 0; i < names.length; i++) {
        if (names[i].length > 0 && names[i] !== '') {
          initials += names[i][0];
        }
      }
  
      if (initials.length > 2) {
        const length: number = initials.length;
        initials = initials.substring(0,1) + initials.substring(length - 1);
      }
    }

    return initials;
  }

  updateCommentPermissions() {
    this.filteredCommentList.forEach(comment => {
      if (comment.user_name == this.userName) {
        comment.is_editable = true;
        comment.display_edit = true;
        comment.display_delete = false;
        comment.display_report = false;
        comment.display_dropdown = false;
      }
      else {
        comment.is_editable = false;
        comment.display_edit = false;
        comment.display_delete = false;
        comment.display_report = true;
        comment.display_dropdown = false;
      }
    })
  }

  openUpdatesView() {
    this.displayMainView = false;
    this.displayCommentsView = false;
    this.displayAddCommentsView = false;
    this.displayUpdatesView = true;
  }

  openCommentsView() {
    this.displayMainView = false;
    this.displayUpdatesView = false;
    this.displayAddCommentsView = false;
    this.displayCommentsView = true;
  }

  openAddCommentsView() {
    this.displayCommentsView = false;
    this.displayUpdatesView = false;
    this.displayMainView = false;
    this.displayAddCommentsView = true;
  }

  openMainView() {
    this.displayCommentsView = false;
    this.displayUpdatesView = false;
    this.displayAddCommentsView = false;
    this.displayMainView = true;
  }

  onEditCommentClick(index: number) {
    this.filteredCommentList[index].display_edit = false;
    this.filteredCommentList[index].display_delete = true;
    this.editedComment = this.filteredCommentList[index].comment;
  }

  updateCommentSave(index: number) {
    const comment: any = this.filteredCommentList[index];
    comment.comment = this.editedComment;
    this.updateComment(comment, index);
  }

  updateCommentCancel(index: number) {
    this.filteredCommentList[index].display_delete = false;
    this.filteredCommentList[index].display_edit = true;
  }

  reportComment(index: number) {
    const alert: any = this.filteredCommentList[index];

    var emailMessage = {
      From: "report@ucalertmaps.com",
      To: "ucalertmaps@outlook.com",
      Content: "CommentId " + alert.comment_id + " was flagged for review.",
      Subject: "UC Alert Comment Reported"
    };

    this.service
      .reportComment(emailMessage)
      .pipe(retry(1))
      .subscribe({
        next: (result: any) => {
          if (result) {
            
          }
        }
      })
  }

  validateComment() {
    if (this.comment != "") {
      const newComment = {
        alert_id: this.data.alertID,
        comment: this.comment,
        user_name: this.userName,
        added_date: new Date(), 
      }

      this.postComment(newComment);
    }
  }

  postComment(comment: any) {
    this.service
      .postComment(comment)
      .pipe(retry(1))
      .subscribe({
        next: (result: any) => {
          if (result == "Added Successfully") {
            this.handlePostCommentResponse(comment);
          }
        }
      });
  }

  updateComment(comment: any, index: number) {
    this.service  
      .updateComment(comment)
      .pipe(retry(1))
      .subscribe({
        next: (result: any) => {
          if (result == "Added Successfully") {
            this.handleUpdateDeleteCommentResponse(index)
          }
        }
      })
  }

  deleteComment(index: number) {
    //const comment: any = this.filteredCommentList[index];

    // Fake Delete
    this.filteredCommentList.splice(index, 1);

    // this.service
    //   .deleteComment(comment.comment_id)
    //   .pipe(retry(1))
    //   .subscribe({
    //     next: (result: any) => {
    //       if (result == "Deleted Successfully") {
    //         this.handleUpdateDeleteCommentResponse(index);
    //       }
    //     }
    //   });
  }

  handlePostCommentResponse(comment: any) {
    // Update Comment List Storage
    this.getAlertComments();

    // Close Add Comment View
    this.displayAddCommentsView = false;
    this.displayMainView = true;
  }

  handleUpdateDeleteCommentResponse(index: number) {
    this.filteredCommentList[index].display_delete = false;
    this.filteredCommentList[index].display_edit = true;
    this.getAlertComments();
  }

  getAlertComments() {
    // Get Comments from Database
    this.service
      .getCommentsList()
      .subscribe({
        next: (comments: Array<any>) => {
          if (comments){
            localStorage.setItem('commentList',JSON.stringify(comments));
            this.filterCommentsList(this.data.alertID);
          }
        }
      })
  }

  openPostingPublicDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = "245px";
    dialogConfig.width = "375px";
    this.dialog.open(PostingPubliclyComponent, dialogConfig);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
