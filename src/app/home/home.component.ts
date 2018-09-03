import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { SignedUser } from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: SignedUser;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
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
}
