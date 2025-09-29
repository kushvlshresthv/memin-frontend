import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-member',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-member.component.html',
  styleUrl: './create-member.component.scss'
})
export class CreateMemberComponent {

    firstName =  new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]);

    lastName =  new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]);

    username =  new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]);

    post =  new FormControl('', [Validators.required]);
    title = new FormControl('', [Validators.required]);
    email =  new FormControl('', [Validators.email]);
    institution =  new FormControl('', [Validators.maxLength(100)]);

  formData = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    post: this.post,
    title: this.title,
    email: this.email,
    institution: this.institution
  });

  onSubmit() {

  }

}
