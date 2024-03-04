import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signUpForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      const userData = this.signUpForm.value;
      console.log(userData);
      // Make a POST request to your API for user registration
      this.http
        .post<any>('http://192.168.50.92:3000/auth/register', userData)
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
      ValidateForm.validateAllFormFileds(this.signUpForm);
      console.log('Form is not valid');
    }
  }
}
