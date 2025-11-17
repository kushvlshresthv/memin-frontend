import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of, Subscription } from 'rxjs';
import { Response } from '../response/response';
import { BACKEND_URL } from '../../global_constants';
import { validateUsernameFormat } from './login.validators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  httpClient = inject(HttpClient);
  subscription!: Subscription;


  formData = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, validateUsernameFormat],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  username!: FormControl;
  password!: FormControl;

  ngOnInit(): void {
    this.username = this.formData.controls.username;
    this.password = this.formData.controls.password;
  }

  onSubmit() {
    const authenticationDetails = `${this.username.value}:${this.password.value}`;
    const encodedAuthenticationDetails = btoa(authenticationDetails);

    const headers = new HttpHeaders({
      Authorization: `Basic ${encodedAuthenticationDetails}`,
    });

    this.subscription = this.httpClient
      .get<Response<Object>>(BACKEND_URL + '/api/login', {
        headers: headers,
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.router.navigateByUrl('/home/my-committees');
        },
        error: (error) => {
          console.log(error.error.message);
          this.router.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
