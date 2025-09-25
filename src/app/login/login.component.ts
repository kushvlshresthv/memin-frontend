import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { validateUsernameFormat } from './login.validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  http = inject(HttpClient);

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
    console.log('form has been submitted');
  }
}
