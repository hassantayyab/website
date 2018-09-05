import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService, SnotifyPosition } from 'ng-snotify';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    password: ''
  };
  submitted = false;

  constructor(
    private router: Router,
    private snotifyService: SnotifyService,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;
    this.afAuth.auth
      .signInWithEmailAndPassword(this.user.email, this.user.password)
      .then(user => {
        if (user) {
          this.router.navigate(['/home']);
        }
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ERROR =>', errorCode, errorMessage);
        this.snotifyService.error('Please create account first', {
          position: SnotifyPosition.rightTop,
          titleMaxLength: 180,
          showProgressBar: false,
          pauseOnHover: true
        });
        this.router.navigate(['/signup']);
      });
  }
}
