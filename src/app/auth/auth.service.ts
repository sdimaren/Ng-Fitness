import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router, private afAuth: AngularFireAuth) {}
  
  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(res => {
      console.log(res);
      this.authSuccessful();
    })
    .catch(err => {
      console.log(err);
    });
  }

  login(authData: AuthData) {
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(res => {
      console.log(res);
      this.authSuccessful();
    })
    .catch(err => {
      console.log(err);
    });
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return {... this.user };
  }

  isAuth() {
    return this.user != null;
  }
  private authSuccessful() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
  
}