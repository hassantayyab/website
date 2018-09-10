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
  private folderCollection: AngularFirestoreCollection<Item | null>;
  folders: Observable<Item[]>;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.folderCollection = this.afs.collection<Item>('folders');
    this.folders = this.folderCollection.valueChanges();
  }

  getFolders() {
    return this.folders;
  }

  addFolders(folders: Item, id: any) {
    this.folderCollection.doc(id).set(folders);
  }
}
