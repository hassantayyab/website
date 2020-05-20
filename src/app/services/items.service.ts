import { FileItem } from './../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';
import { HttpClient } from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Item, Folder } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private folderCollection: any;
  folders: Observable<Item[]>;

  private fileCollection: any;
  files: Observable<FileItem[]>;

  downloadURL: Observable<string | null>;
  delete: Observable<any | null>;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {}

  getFolders(id: any): any {
    this.folderCollection = this.afs.collection<Item>('folders').doc(id);
    this.folders = this.folderCollection.valueChanges();
    return this.folders;
  }

  addFolders(folders: Item, id: any) {
    this.folderCollection.set(folders);
  }

  deleteFolder(folder: Item, id: any) {
    this.folderCollection.set(folder);
  }

  getFiles(id: any): any {
    this.fileCollection = this.afs.collection<Item>('files').doc(id);
    this.files = this.fileCollection.valueChanges();
    return this.files;
  }

  addFiles(files: FileItem, id: any) {
    this.fileCollection.set(files);
  }

  storeFile(file) {
    return new Observable(observer => {
      let filePath;
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        filePath = 'images/' + file.name;
      }
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      // get notified when the download URL is available
      task
        .snapshotChanges()
        .pipe(finalize(() => (this.downloadURL = fileRef.getDownloadURL())))
        .subscribe(
          res => {
            console.log('progress =>', this.downloadURL, res);
            observer.next(false);
          },
          err => {
            console.log('ERROR in downloading URL =>', err);
            observer.error(false);
          },
          () => {
            observer.next(filePath);
          }
        );
    });
  }

  getFileUrl(filePath) {
    const ref = this.storage.ref(filePath);
    this.downloadURL = ref.getDownloadURL();
    return this.downloadURL;
  }

  deleteFile(file: FileItem, id: any, filePath, name) {
    return new Observable(observer => {
      this.fileCollection.set(file);
      this.deleteFileFromStorage(file, filePath, name).subscribe(
        res => {
          observer.next(res);
        },
        err => {
          observer.error(false);
        }
      );
    });
  }

  deleteFileFromStorage(file: FileItem, filePath, name) {
    const ref = this.storage.ref(filePath);
    this.delete = ref.child(name).delete();
    return this.delete;
    // return new Observable(observer => {
    //   const ref = this.storage.ref(filePath);
    //   ref.delete().subscribe(
    //     res => {
    //       observer.next(res);
    //     },
    //     err => {
    //       console.log('ERROR in deleteFileFromStorage');
    //       observer.error(false);
    //     }
    //   );
    // });
  }
}
