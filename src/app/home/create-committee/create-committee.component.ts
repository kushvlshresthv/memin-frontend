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
import { MemberSearchResult } from '../../models/models';
import { RecognizeNepaliTextDirective } from '../../utils/recognize-nepali-text.directive';
import { SafeCloseDialogDirective } from '../../utils/safe-close-dialog.directive';
import { MemberSelectionService } from './select-member-for-committee/select-member-for-committee.service';

@Component({
  selector: 'app-create-committee',
  standalone: true,
  imports: [ReactiveFormsModule, SelectMemberForCommitteeComponent, RecognizeNepaliTextDirective, SafeCloseDialogDirective],
  templateUrl: './create-committee.component.html',
  styleUrl: './create-committee.component.scss',
})
export class CreateCommitteeComponent {
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_project_dialogue');

  memberSelectionService = inject(MemberSelectionService);

  name = new FormControl();
  description = new FormControl();
  defaultOptionForCoordinator: MemberSearchResult = {
    memberId: 0,
    firstName: 'Select',
    lastName: 'Coordinator',
    post: '',
    institution: '',
  };
  coordinator = new FormControl<MemberSearchResult>(
    this.defaultOptionForCoordinator,
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
      this.memberSelectionService.addMemberToDisplayedMembers(
        this.currentCoordinator,
      );
    }

    this.memberSelectionService.removeMemberFromUnselectedMembers(
      newCoordinator,
    );
    this.memberSelectionService.removeMemberFromDisplayedMembers(newCoordinator);
    this.currentCoordinator = this.coordinator.value;
    console.log(this.memberSelectionService.unselected());
  }

  onDialogClick(event: any) {}
  onSubmit() {}
}
