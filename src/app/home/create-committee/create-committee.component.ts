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
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { SelectMemberForCommitteeComponent } from './select-member-for-committee/select-member-for-committee.component';
import { MemberSelectionService } from './member-selection.service';
import { MemberSearchResult } from '../../models/models';

@Component({
  selector: 'app-create-committee',
  standalone: true,
  imports: [ReactiveFormsModule, SelectMemberForCommitteeComponent],
  templateUrl: './create-committee.component.html',
  styleUrl: './create-committee.component.scss',
})
export class CreateCommitteeComponent {
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_project_dialogue');
  memberSelectionService = inject(MemberSelectionService);
  name = new FormControl();
  description = new FormControl();
  coordinator = new FormControl<MemberSearchResult>(
    {
      memberId: 0,
      firstName: '',
      lastName: '',
      post: '',
      institution: '',
    },
    {
      nonNullable: true,
    },
  );
  status = new FormControl('ACTIVE');
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

  currentCoordinator!: MemberSearchResult;

  onCoordinatorSelectionOrChange() {
    const newCoordinator = this.coordinator.value;
    if (this.currentCoordinator != undefined) {
      this.memberSelectionService.addMemberToUnselectedMembers(
        this.currentCoordinator,
      );
      this.memberSelectionService.addMemberToSearchedMembers(
        this.currentCoordinator,
      );
    }

    this.memberSelectionService.removeMemberFromUnselectedMembers(
      newCoordinator,
    );
    this.memberSelectionService.removeMemberFromSearchedMembers(newCoordinator);
    this.currentCoordinator = this.coordinator.value;
    console.log(this.memberSelectionService.unselected());
  }

  onOpenDialog() {}
  onDialogClick(event: any) {}
  onSubmit() {}
}
