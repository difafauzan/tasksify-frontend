import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  canActivate() {
    let role = localStorage.getItem('userType');
    if (role == 'admin') {
      return true;
    }
    alert('You dont have access!');
    
    return false;
  }
}
