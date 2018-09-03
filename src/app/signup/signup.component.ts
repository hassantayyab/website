import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService, SnotifyPosition } from 'ng-snotify';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class SignupComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    password: ''
  };
  confirmPassword: string = '';
  submitted = false;

  constructor(
    private router: Router,
    private snotifyService: SnotifyService,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.confirmPassword === this.user.password) {
      console.log('Hello');
      this.submitted = true;
      this.afAuth.auth
        .createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then(res => {
          console.log('res =>', res);
        });
      this.router.navigate(['/home']);
    } else {
      this.snotifyService.create({
        title: 'passwords do not match',
        body: null,
        config: {
          position: SnotifyPosition.rightTop,
          titleMaxLength: 180,
          showProgressBar: false
          // type: SnotifyService.SnotifyStyle.error
        }
      });
    }
  }
}
