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
import { SafeCloseDialogDirective } from '../../utils/safe-close-dialog.directive';

@Component({
  selector: 'app-create-member',
  standalone: true,
  imports: [ReactiveFormsModule, SafeCloseDialogDirective],
  templateUrl: './create-member.component.html',
  styleUrl: './create-member.component.scss',
})
export class CreateMemberComponent implements AfterViewInit {
  diag = viewChild<ElementRef<HTMLDialogElement>>('create_member_dialog');

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

  //for development purposes only, keeps the dialog always open
  // constructor() {
  //   effect(() => {
  //     this.diag()!.nativeElement.showModal();
  //   });
  // }

  onSubmit() {}

}
