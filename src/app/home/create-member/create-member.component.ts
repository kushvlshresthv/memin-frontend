import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MemberCreationDto, MemberDetailsDto } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../global_constants';
import { Router } from '@angular/router';
import { SelectInviteeForMeetingComponent } from '../create-meeting/select-invitee-for-meeting/select-invitee-for-meeting.component';
import { SafeCloseDialogCustom } from '../../utils/safe-close-dialog-custom.directive';

@Component({
  selector: 'app-create-member',
  standalone: true,
  imports: [ReactiveFormsModule, SafeCloseDialogCustom],
  templateUrl: './create-member.component.html',
  styleUrl: './create-member.component.scss',
})
export class CreateMemberComponent implements AfterViewInit {
  FORM_NAME = 'create_member_form';
  diag = viewChild<ElementRef<HTMLDialogElement>>('create_member_dialog');

  constructor(private httpClient: HttpClient, private router: Router) {}

  firstName = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);

  lastName = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);

  username = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25),
  ]);

  post = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.email]);
  institution = new FormControl('', [Validators.maxLength(100)]);

  formData = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    post: this.post,
    title: this.title,
    email: this.email,
    institution: this.institution,
  });

  ngAfterViewInit(): void {
    // Show the dialog
    if (this.diag() && !this.diag()!.nativeElement.open) {
      this.diag()!.nativeElement.showModal();
    }
  }

  onSubmit($event: Event) {
    console.log("onSubmitted called");
    $event.preventDefault();
    const requestBody = new MemberCreationDto();
    requestBody.firstName = this.firstName.value!;
    requestBody.lastName = this.lastName.value!;
    requestBody.username = this.username.value!;
    requestBody.post = this.post.value!;
    requestBody.title = this.title.value!;
    requestBody.email = this.email.value!;
    requestBody.institution = this.institution.value!;

    this.httpClient
      .post<Response>(BACKEND_URL + '/api/createMember', requestBody, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          //TODO: change this
          localStorage.removeItem(this.FORM_NAME);
          this.router.navigate(['/home/my-committees']);
        },
        error: (error) => console.log(error.error.message),
      });
    this.diag()!.nativeElement.close();
  }

  saveFormData = () => {

    const formValue = this.formData.getRawValue();

    // Check if at least one field has some value
    const hasData = Object.values(formValue).some(
      (value) => value !== null && value !== undefined && value !== '',
    );

    if (!hasData) {
      return;
    }

    localStorage.setItem(this.FORM_NAME, JSON.stringify(formValue));
  };


  restoreFormData = () => {
    //restore form normally ie restores the FormGroup
    const savedData = localStorage.getItem(this.FORM_NAME);
    if (savedData) {
      console.log("Found the saved Data");
      console.log(savedData);
      try {
        const parsedData = JSON.parse(savedData);
        this.formData.patchValue(parsedData); // prefill the form
      } catch (err) {
        console.error('Failed to parse saved form data', err);
      }
    }
  }
}
