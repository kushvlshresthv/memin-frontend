import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MemberService } from '../../members-service.service';
import { MemberSearchResult } from '../../models/models';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { SelectMemberForCommitteeComponent } from './select-member-for-committee/select-member-for-committee.component';

@Component({
  selector: 'app-create-committee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SearchBarComponent,
    SelectMemberForCommitteeComponent,
  ],
  templateUrl: './create-committee.component.html',
  styleUrl: './create-committee.component.scss',
})
export class CreateCommitteeComponent {
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_project_dialogue');
  memberService = inject(MemberService);
  allMembers!: MemberSearchResult[];
  subscription = this.memberService.loadAllMembers().subscribe({
    next: (response) => (this.allMembers = response),
    error: (error) => {
      //TODO: handle error with popup
      console.log(error);
    },
  });
  name = new FormControl();
  description = new FormControl();
  coordinator = new FormControl();
  status = new FormControl();
  maxNoOfMeetings = new FormControl();
  formData = new FormGroup({
    name: this.name,
    description: this.description,
    coordinator: this.coordinator,
    status: this.status,
    maxNoOfMeetings: this.maxNoOfMeetings,
  });

  constructor() {
    effect(() => {
      this.diag()!.nativeElement.showModal();
    });
  }

  onOpenDialog() {}
  onDialogClick(event: any) {}
  onSubmit() {}
}
