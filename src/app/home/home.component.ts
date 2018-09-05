import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { SignedUser } from '../models/user.model';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: SignedUser;
  menu: boolean = false;
  folderName: string;
  folders: string[] = [];

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.user = {
      displayName: '',
      email: '',
      emailVerified: '',
      photoURL: '',
      isAnonymous: '',
      uid: '',
      providerData: ''
    };
  }

  ngOnInit() {
    console.log('folders =>', this.folders);
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.user.displayName = user.displayName;
        this.user.email = user.email;
        this.user.emailVerified = user.emailVerified;
        this.user.photoURL = user.photoURL;
        this.user.isAnonymous = user.isAnonymous;
        this.user.uid = user.uid;
        this.user.providerData = user.providerData;

        console.log('this.user =>', this.user);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  onSignout() {
    this.afAuth.auth.signOut();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FolderPopup, {
      width: '300px',
      data: { folderName: this.folderName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.folders.unshift(result);
        this.storeFolders();
      }
      console.log('The dialog was closed', this.folders);
    });
  }

  storeFolders() {}

  folderClicked(folder) {
    console.log('folder clicked', folder);
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html'
})
export class FolderPopup {
  constructor(
    public dialogRef: MatDialogRef<FolderPopup>,
    @Inject(MAT_DIALOG_DATA) public data: object
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
