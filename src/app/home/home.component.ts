import { File } from './../models/user.model';
import { ItemsService } from './../services/items.service';
import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
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
  files: File[] = [];
  dataSource: any;
  displayedColumns: string[] = ['select', 'name', 'updated'];
  selection = new SelectionModel<Folder>(true, []);

  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private itemsService: ItemsService,
    public dialog: MatDialog,
    private zone: NgZone
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
    this.checkLogin().subscribe(
      res => {
        this.getData().subscribe(
          res => {
            this.itemsService.getFilesUrl().subscribe(
              res => {
                // console.log('url =>', res);
              },
              err => {
                // console.log('err =>', err);
              }
            );
          },
          err => {}
        );
      },
      err => {
        // this.router.navigate(['/login']);
        this.zone.run(() => this.router.navigate(['/login']));
      }
    );
  }

  onFileSelected(event) {
    // console.log('file selected =>', event.path[0].files[0]);
    const file = event.path[0].files[0];
    console.log('file =>', file.name);
    this.itemsService.storeFile(file).subscribe(
      res => {
        this.itemsService.getFilesUrl().subscribe(res => {
          console.log('url =>', res);
          this.files.unshift({
            name: file.name,
            updated: new Date(),
            url: res
          });
          this.itemsService.addFiles({ content: this.files }, this.user.uid);
        });
      },
      err => {
        // console.log(err);
      }
    );
  }

  folderDelete(i) {
    this.folders.splice(i, 1);
    this.itemsService.deleteFolder({ content: this.folders }, this.user.uid);
  }

  checkLogin() {
    return new Observable(observer => {
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
          observer.next(true);
        } else {
          observer.error(false);
        }
      });
    });
  }

  getData() {
    return new Observable(observer => {
      this.itemsService.getFolders(this.user.uid).subscribe(res => {
        if (res.content) {
          this.folders = res.content;
          this.dataSource = new MatTableDataSource(this.folders);
          this.dataSource.sort = this.sort;
          this.itemsService.getFiles(this.user.uid).subscribe(res => {
            if (res.content) {
              this.files = res.content;
              this.isLoading = false;
              observer.next(true);
            } else {
              this.isLoading = false;
              observer.error(false);
            }
          });
          // console.log('FOLDERS =>', this.folders);
        }
      });
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
        // console.log('this.folders =>', this.folders);
        this.itemsService.addFolders({ content: this.folders }, this.user.uid);
      }
    });
  }

  editFolder(i): void {
    const dialogRef = this.dialog.open(FolderPopup, {
      width: '300px',
      data: { folderName: this.folderName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.folders.unshift({ name: result, updated: new Date() });
        // console.log('this.folders =>', this.folders);
        // this.itemsService.addFolders({ content: this.folders }, this.user.uid);
        this.folders[i].name = result;
        this.folders[i].updated = new Date();
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

  folderSubmitted(event) {
    // console.log('event =>', event);
    if (event.key === 'Enter') {
      this.dialogRef.close();
    }
  }
}
