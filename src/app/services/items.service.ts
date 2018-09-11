import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
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

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
  }

  getFolders(id: any): any {
    this.folderCollection = this.afs.collection<Item>('folders').doc(id);
    this.folders = this.folderCollection.valueChanges();
    return this.folders;
    // this.folders = this.folderCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
    //   const data = a.payload.doc.data();
    //   const id = a.payload.doc.id;
    //   return { id, ...data };
    // })))
    // return this.folders;
  }

  addFolders(folders: Item, id: any) {
    this.folderCollection.set(folders);
  }

  deleteFolder(folders: Item, id: any) {
    this.folderCollection.set(folders);
}
