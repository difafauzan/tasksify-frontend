import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }

    this._snackBar.open('You have not Logged in!', '', {
      duration: 2000,
      verticalPosition: 'top',
    });
    

    this.router.navigate(['/login']);
    console.log('User is not logged in. Redirecting to login page.');
    return false;
  }
}
