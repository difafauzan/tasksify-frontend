import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      console.log(userData);
      // Make a POST request to your API for user registration
      this.http
        .post<any>('http://192.168.50.92:3000/auth/login', userData)
        .pipe(
          catchError((error: any) => {
            console.error('Error during registration:', error);
            throw error;
          })
        )
        .subscribe((response) => {
          // Handle successful registration response, e.g., store token, navigate to home, etc.
          console.log('User registered successfully:', response);
        });
    } else {
      // View error
      ValidateForm.validateAllFormFileds(this.loginForm);
      console.log('Form is not valid');
    }
  }
}
