import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cookies: CookieService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onSubmit() {
    // Set access token
    let accessToken = this.cookies.get('access-token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });
    let options = { headers: headers };
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      this.http
        .post<any>('http://192.168.50.92:3000/auth/login', userData, options)
        .pipe(
          catchError((error: any) => {
            // console.error('Error during login:', error);
            this._snackBar.open('Error during login!', '', {
              duration: 2000,
              verticalPosition: 'top',
            });
            throw error;
          })
        )
        .subscribe(
          (res) => {
            if (res && res.backendTokens && res.backendTokens.accessToken) {
              // Handle successful login response
              this.cookies.set('access-token', res.backendTokens.accessToken);
              this.cookies.set('refresh-token', res.backendTokens.refreshToken);
              this.cookies.set('user-id', res.user.id);
              this.cookies.set('user-email', res.user.email);
              this.cookies.set('user-name', res.user.name);

              // console.log('User logged in successfully:', res);
              this._snackBar.open('Login Successfully!', '', {
                duration: 2000,
                verticalPosition: 'top',
              });
              this.router.navigate(['/board']);
            } else {
              // Handle invalid login response
              // console.error('Invalid login response:', res);

              this._snackBar.open(
                'Invalid login response. Please try again.',
                '',
                {
                  duration: 2000,
                  verticalPosition: 'top',
                }
              );
            }
          },
          (error) => {
            // console.error('Login failed:', error);
            // alert('Login failed. Please try again.');
            this._snackBar.open('Login failed , please try again!', '', {
              duration: 2000,
              verticalPosition: 'top',
            });
          }
        );
    } else {
      // View error
      ValidateForm.validateAllFormFileds(this.loginForm);
      // console.log('Form is not valid');
      this._snackBar.open('Form is not valid!', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }
  }
}
