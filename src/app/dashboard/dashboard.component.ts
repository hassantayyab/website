import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface User {
  password: string;
  email: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User = {
    password: '',
    email: ''
  };

  passwordValid = false;

  submitted = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;
    console.log(this.user.password.length);
    if (this.user.password.length > 5) {
      this.passwordValid = true;
    } else {
      this.passwordValid = false;
    }
    console.log(this.user);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserPopup, {
      width: '250px',
      data: { password: this.user.password, email: this.user.email }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-userpopup',
  templateUrl: 'userpopup.component.html'
})
export class UserPopup {
  constructor(
    public dialogRef: MatDialogRef<UserPopup>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
