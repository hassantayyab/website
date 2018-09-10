import { ItemsService } from './../services/items.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SignedUser, Item, Folder } from '../models/user.model';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sidenavType: any = { mode: 'push', drop: true };
  loggedIn: boolean = false;
  isLoading: boolean = true;
  user: SignedUser;
  menu: boolean = false;
  folderName: string;
  folders: Folder[] = [];
  dataSource: any;
  displayedColumns: string[] = ['select', 'name', 'updated'];
  selection = new SelectionModel<Folder>(true, []);

  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private itemsService: ItemsService,
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => {
          console.log('row =>', row);
          this.selection.select(row);
        });
  }

  ngOnInit() {
    this.checkLogin();
  }

  folderClicked() {
    console.log('clicked');
  }

  checkLogin() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.user.displayName = user.displayName;
        this.user.email = user.email;
        this.user.emailVerified = user.emailVerified;
        this.user.photoURL = user.photoURL;
        this.user.isAnonymous = user.isAnonymous;
        this.user.uid = user.uid;
        this.user.providerData = user.providerData;
        this.loggedIn = true;
        this.itemsService.getFolders().subscribe(res => {
          console.log('res =>', res[0].content);
          if (res[0].content) {
            this.folders = res[0].content;
            this.dataSource = new MatTableDataSource(this.folders);
            this.dataSource.sort = this.sort;
            this.isLoading = false;
            // this.folders.forEach(folder => {
            //   folder.updated = new Date(folder.updated.toLocaleString());
            // });
            console.log('FOLDERS =>', this.folders);
          }
        });

        console.log('this.user =>', this.user);
        console.log('loggedIn =>', this.loggedIn);
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
        this.folders.unshift({ name: result, updated: new Date() });
        console.log('this.folders =>', this.folders);
        this.itemsService.addFolders({ content: this.folders }, this.user.uid);
      }
    });
  }
}

// Folder Popup Component
@Component({
  selector: 'folder-popup',
  templateUrl: 'folder-popup.html'
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
