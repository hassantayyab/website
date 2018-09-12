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
import { map } from 'rxjs/operators';
import { Item, Folder } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private folderCollection: any;
  folders: Observable<Item[]>;

  private fileCollection: any;
  files: Observable<FileItem[]>;

  profileUrl: Observable<string | null>;

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

  deleteFolder(folders: Item, id: any) {
    this.folderCollection.set(folders);
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
      const task = this.storage.upload(filePath, file);
      if (task) {
        observer.next(task);
      } else {
        observer.error(false);
      }
      observer.complete();
    });
  }

  getFilesUrl() {
    const ref = this.storage.ref('images/File.jpg');
    this.profileUrl = ref.getDownloadURL();
    return this.profileUrl;
  }
}
