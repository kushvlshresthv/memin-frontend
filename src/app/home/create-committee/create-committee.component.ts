import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
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
  imports: [
    ReactiveFormsModule,
    SelectMemberForCommitteeComponent,
    RecognizeNepaliTextDirective,
    SafeCloseDialogDirective,
  ],
  templateUrl: './create-committee.component.html',
  styleUrl: './create-committee.component.scss',
  providers: [MemberSelectionService],
})
export class CreateCommitteeComponent implements OnDestroy {
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_project_dialogue');

  memberSelectionService = inject(MemberSelectionService);

  name = new FormControl();
  description = new FormControl();
  defaultOptionForCoordinator: MemberSearchResult = {
    memberId: 0,
    firstName: '',
    lastName: '',
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
    this.memberSelectionService.removeMemberFromDisplayedMembers(
      newCoordinator,
    );
    this.currentCoordinator = this.coordinator.value;
    console.log(this.memberSelectionService.unselected());
  }

  onDialogClick(event: any) {}
  onSubmit() {}

  /* used by the template to compare two coordinators in the select coordinator dropdown

   *  without this function, angular will compare the two objects by reference which will not work as expected in the case:
   *  when the Safe Close Dialog Directive saves and tries to restore the coordinator
   *  while restoring, a new object is created with the same values but different reference
   *  hence angular will not be able to select the correct option in the dropdown and will have blank value

   */
  compareCoordinators(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.memberId === o2.memberId : o1 === o2;
  }

  saveForm = () =>{
    //save the form except for the coordinator
    (this.formData as any).removeControl('coordinator');
    localStorage.setItem(
      'createCommitteeForm',
      JSON.stringify(this.formData.getRawValue()),
    );


    //save the selected members
    localStorage.setItem(
      'selectedMembersWithRole',
      JSON.stringify(this.memberSelectionService.selectedWithRoles()),
    );
  }

  restoreForm = () =>  {
    //restore the form except for the coordinator
    const savedForm = localStorage.getItem('createCommitteeForm');
    if (savedForm) {
      try {
        const parsedData = JSON.parse(savedForm);
        this.formData.patchValue(parsedData);
      } catch (err) {
        console.error('Error parsing saved form data:', err);
      }
    }
  }

  ngOnDestroy() {
    console.log('DEBUG: create-committee component destroyed');
  }
}
