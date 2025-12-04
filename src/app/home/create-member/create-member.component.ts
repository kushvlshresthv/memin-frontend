import {
  Component,
} from '@angular/core';
import { MemberCreationDto, MemberFormData } from '../../models/models';
import { BACKEND_URL } from '../../../global_constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MemberFormComponent } from '../../forms/member-form/member-form.component';

@Component({selector: 'app-create-member',
  standalone: true,
  imports: [MemberFormComponent],
  templateUrl: './create-member.component.html',
  styleUrl: './create-member.component.scss',
})
export class CreateMemberComponent {

  memberFormData: MemberFormData = {
    firstName: '',
    lastName: '',
    post: '',
    title: '',
  }

  constructor(private httpClient: HttpClient, private router: Router){}


  onFormSave(requestBody: MemberCreationDto) {
    console.log("onSubmitted called");

    this.httpClient
      .post<Response>(BACKEND_URL + '/api/createMember', requestBody, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/home/my-committees']);
        },
        error: (error) => console.log(error.error.message),
      });
  }
}
