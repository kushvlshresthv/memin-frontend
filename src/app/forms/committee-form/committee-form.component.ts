import {
  Component,
  effect,
  ElementRef,
  input,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MemberSearchResult,
  CommitteeCreationDto,
  MemberIdAndRole,
} from '../../models/models';
import { SafeCloseDialogCustom } from '../../utils/safe-close-dialog-custom.directive';
import { debounceTime, map, Observable, startWith, Subscription } from 'rxjs';
import Fuse from 'fuse.js';
import { CommitteeFormData } from '../../home/create-committee/create-committee.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatOption,
} from '@angular/material/autocomplete';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-committee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SafeCloseDialogCustom,
    DragDropModule,
    MatAutocomplete,
    MatOption,
    MatFormField,
    MatAutocompleteModule,
    AsyncPipe,
    MatLabel,
    OverlayModule,
  ],
  templateUrl: './committee-form.component.html',
  styleUrl: './committee-form.component.scss',
})
export class CommitteeFormComponent implements OnInit {
  diag = viewChild<ElementRef<HTMLDialogElement>>('committee_form_dialog');

  showDropdown = false;
  memberIdForWhomDropDownIsSelected = -1;
  dropdownTop = 0;
  dropdownLeft = 0;

  onFocus(event: FocusEvent) {
    const input = event.target as HTMLElement;
    const rect = input.getBoundingClientRect();
    this.dropdownTop = rect.bottom + 4;
    this.dropdownLeft = rect.left;
  }

  // Form Drag and drop reorder

  drop(event: CdkDragDrop<MemberSearchResult[]>) {
    moveItemInArray(
      this.selectedMembersWithRoles,
      event.previousIndex,
      event.currentIndex
    );
    console.log('drop executed');
    console.log(this.selectedMembersWithRoles);
  }

  initializeFormControls() {
    this.selectedMembersWithRoles.forEach((item) => {
      const control = this.memberAndRoleFormControlMap.get(
        item.member.memberId
      );
      if (control) {
        control.setValue(item.role, { emitEvent: false });
      }
    });
  }

  //SELECT MEMBER SECTION OF THE FORM
  //---------------------------------------------------------------------------

  searchInputFieldSubscription!: Subscription;

  //inputs
  isEditPage = input.required<boolean>();
  committeeFormData = input.required<CommitteeFormData>();

  //variables
  unselectedMembers: MemberSearchResult[] = [];
  displayedMembers: MemberSearchResult[] = [];
  selectedMembersWithRoles: {
    member: MemberSearchResult;
    role: string;
  }[] = [];

  //initialize data for both right and left panel

  ngOnInit(): void {
    this.setupObservableForSearchBarInputChange();

    this.name = new FormControl(this.committeeFormData().name, {
      nonNullable: true,
    });
    this.description = new FormControl(this.committeeFormData().description, {
      nonNullable: true,
    });
    this.status = new FormControl(this.committeeFormData().status, {
      nonNullable: true,
    });
    this.maxNoOfMeetings = new FormControl(
      this.committeeFormData().maxNoOfMeetings,
      { nonNullable: true }
    );
    this.minuteLanguage = new FormControl(
      this.committeeFormData().minuteLanguage
    );

    //set unselected members and display them as well
    this.unselectedMembers = this.committeeFormData().unselectedMembers;
    this.displayedMembers = this.unselectedMembers;

    //add form controls for each member
    this.unselectedMembers.forEach((member) => {
      this.memberAndRoleFormControlMap.set(
        member.memberId,
        new FormControl('', { nonNullable: true })
      );
    });

    if (this.isEditPage()) {
      //if edit page, there may be already some selected members
      this.committeeFormData().selectedMembersWithRoles.forEach(
        (memberWithRole) => {
          this.addMemberToSelectedMembersWithRolesAndSync(
            memberWithRole.member,
            memberWithRole.role
          );

          //for those selected members, initialize the RoleFormControl with the roles of selected members as well
          this.memberAndRoleFormControlMap
            .get(memberWithRole.member.memberId)!
            .setValue(memberWithRole.role);
        }
      );
    }

    //at last, add coordinator at last because coordinator has to be removed from the unselectedMembers
    this.coordinator = new FormControl(this.committeeFormData().coordinator, {
      nonNullable: true,
    });
    //this needs to be set because onCoordinatorSelect() relies on this to restore when a new coordaintor is selected
    this.currentCoordinator = this.committeeFormData().coordinator;
    this.removeMemberFromDisplayedMembers(this.committeeFormData().coordinator);
    this.removeMemberFromUnselectedMembers(
      this.committeeFormData().coordinator
    );

    //finally initialize the form group for right panel
    this.committeeFormGroup = new FormGroup({
      name: this.name,
      description: this.description,
      coordinator: this.coordinator,
      status: this.status,
      maxNoOfMeetings: this.maxNoOfMeetings,
      minuteLanguage: this.minuteLanguage,
    });

    //finally restore selected members from local storage
    if (!this.isEditPage()) {
      this.restoreSelectedMembersFromLocalStorage();
    }
  }

  //formControls:
  memberAndRoleFormControlMap = new Map<number, FormControl<string>>();
  selectMemberFormGroup = new FormGroup({
    searchBarInput: new FormControl(''),
  });

  //when the search bar input changes filter the displayed members after a debounce time,
  setupObservableForSearchBarInputChange() {
    this.searchInputFieldSubscription =
      this.selectMemberFormGroup.controls.searchBarInput.valueChanges
        .pipe(debounceTime(500)) // wait 0.5 seconds after user stops typing
        .subscribe((value) => {
          console.log('searching');
          if (value === '') {
            this.displayedMembers = this.unselectedMembers;
          } else {
            this.displayedMembers = this.fuzzySearchUnselectedMembers(
              value as string
            );
          }
        });
  }

  fuzzySearchUnselectedMembers(query: string): MemberSearchResult[] {
    const fuse = new Fuse(this.unselectedMembers, {
      keys: ['firstName', 'lastName'],
      threshold: 0.3, // lower = stricter match
    });
    return fuse
      .search(query)
      .map((result) => result.item)
      .sort(this.memberSortingFunction);
  }

  private memberSortingFunction = (
    member1: MemberSearchResult,
    member2: MemberSearchResult
  ) => member1.firstName.localeCompare(member2.firstName);

  sortUnselected() {
    return this.displayedMembers.sort(this.memberSortingFunction);
  }

  ngOnDestroy(): void {
    this.searchInputFieldSubscription.unsubscribe();
    console.log('DEBUG: select-member-for-committee component destroyed');
  }

  onRoleSelect(selectedMember: MemberSearchResult) {
    const role = this.memberAndRoleFormControlMap.get(
      selectedMember.memberId
    )!.value;
    this.addMemberToSelectedMembersWithRolesAndSync(selectedMember, role);
  }

  //by sync we mean to remove the selected member from unselected member and displayed member array
  addMemberToSelectedMembersWithRolesAndSync(
    selectedMember: MemberSearchResult,
    role: string
  ) {
    this.removeMemberFromUnselectedMembers(selectedMember);
    this.removeMemberFromDisplayedMembers(selectedMember);
    this.selectedMembersWithRoles.push({
      member: selectedMember,
      role: role,
    });
  }

  removeMemberFromUnselectedMembers(memberToRemove: MemberSearchResult) {
    this.unselectedMembers = this.unselectedMembers.filter(
      (member) => member.memberId != memberToRemove.memberId
    );
  }

  removeMemberFromDisplayedMembers(memberToRemove: MemberSearchResult) {
    this.displayedMembers = this.displayedMembers.filter(
      (member) => member.memberId != memberToRemove.memberId
    );
  }

  removeMemberFromSelectedMembersWithRoles(memberToRemove: MemberSearchResult) {
    this.selectedMembersWithRoles = this.selectedMembersWithRoles.filter(
      (memberWithRole) =>
        memberWithRole.member.memberId != memberToRemove.memberId
    );
  }


  onRoleChange(targetMember: MemberSearchResult): void {
    if (
      this.memberAndRoleFormControlMap.get(targetMember.memberId)!.value ===
      'Remove'
    ) {
      this.unselectedMembers.push(targetMember);
      this.displayedMembers.push(targetMember);
      this.removeMemberFromSelectedMembersWithRoles(targetMember);
      this.memberAndRoleFormControlMap
        .get(targetMember.memberId)!
        .setValue('Add');
    } else {
      const memberToBeUpdatedWithRole = this.selectedMembersWithRoles.find(
        (memberWithRole) =>
          memberWithRole.member.memberId == targetMember.memberId
      );
      memberToBeUpdatedWithRole!.role = this.memberAndRoleFormControlMap.get(
        targetMember.memberId
      )!.value;
    }
  }

  restoreSelectedMembersFromLocalStorage(): void {
    //if loadDataForEditCommitteePage = true, don't restore from local storage
    if (this.isEditPage()) return;

    //restore the selected members and remove them from the unselected list
    const savedSelectedMembers = localStorage.getItem(
      'selectedMembersWithRole'
    );
    if (savedSelectedMembers) {
      try {
        const selectedMembersWithRoles: {
          member: MemberSearchResult;
          role: string;
        }[] = JSON.parse(savedSelectedMembers);

        //for the saved selected members:
        //1. add them to the selected members list
        //2. restore the form control value for their role
        //3. remove them from the unselected members list and displayed members list

        selectedMembersWithRoles.forEach((memberWithRole) => {
          this.addMemberToSelectedMembersWithRolesAndSync(
            memberWithRole.member,
            memberWithRole.role
          );
        });
      } catch (err) {
        console.error('Error parsing saved selected members data:', err);
      }
    }
  }

  //------------------------------------------------------------------------

  //outputs
  formSaveEvent = output<CommitteeCreationDto>();

  //setting aliases for this.committeeFormGroup().controls
  name!: FormControl<string>;
  description!: FormControl<string>;
  coordinator!: FormControl<MemberSearchResult>;
  status!: FormControl<'ACTIVE' | 'INACTIVE'>;
  maxNoOfMeetings!: FormControl<number>;
  minuteLanguage!: FormControl<'NEPALI' | 'ENGLISH' | null>;

  committeeFormGroup!: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
    coordinator: FormControl<MemberSearchResult>;
    status: FormControl<'ACTIVE' | 'INACTIVE'>;
    maxNoOfMeetings: FormControl<number>;
    minuteLanguage: FormControl<'NEPALI' | 'ENGLISH' | null>;
  }>;

  constructor() {
    effect(() => {
      this.diag()!.nativeElement.showModal();
    });
  }

  currentCoordinator!: MemberSearchResult;

  onCoordinatorSelectionOrChange() {
    const newCoordinator = this.coordinator.value;
    //when current coordinator is a valid coordinator, add them ot unselectedMembers, and displayedMembers
    if (this.currentCoordinator.memberId > 0) {
      //add previous coordinator baced to unselected and displayed members
      this.unselectedMembers.push(this.currentCoordinator);
      this.displayedMembers.push(this.currentCoordinator);
    }

    this.removeMemberFromUnselectedMembers(newCoordinator);
    this.removeMemberFromDisplayedMembers(newCoordinator);
    this.currentCoordinator = newCoordinator;
  }

  onSubmit($event: Event) {
    $event.preventDefault();

    const committeeCreationDto = new CommitteeCreationDto();
    committeeCreationDto.name = this.name.value as string;
    committeeCreationDto.description = this.description.value as string;
    committeeCreationDto.coordinatorId = this.coordinator.value.memberId;
    committeeCreationDto.status = this.status.value;
    committeeCreationDto.maximumNumberOfMeetings = this.maxNoOfMeetings
      .value as number;
    committeeCreationDto.minuteLanguage = this.minuteLanguage.value!;

    this.selectedMembersWithRoles.forEach((memberWithRole) => {
      const memberIdAndRole = new MemberIdAndRole();
      memberIdAndRole.memberId = memberWithRole.member.memberId;
      memberIdAndRole.role = memberWithRole.role;
      committeeCreationDto.members.push(memberIdAndRole);

      console.log(memberWithRole.member.firstName);
    });

    console.log('emitting event');
    console.log(committeeCreationDto);

    this.formSaveEvent.emit(committeeCreationDto);
  }

  /* used by the template to compare two coordinators in the select coordinator dropdown

   *  without this function, angular will compare the two objects by reference which will not work as expected in the case:
   *  when the Safe Close Dialog Directive saves and tries to restore the coordinator
   *  while restoring, a new object is created with the same values but different reference
   *  hence angular will not be able to select the correct option in the dropdown and will have blank value

   */
  compareCoordinators(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.memberId === o2.memberId : o1 === o2;
  }

  saveForm = () => {
    //only try to saveForm if loadDataForEditCommitteePage = false
    if (this.isEditPage()) return;

    //save the form EXCEPT for the coordinator
    (this.committeeFormGroup as any).removeControl('coordinator');
    localStorage.setItem(
      'createCommitteeForm',
      JSON.stringify(this.committeeFormGroup.getRawValue())
    );

    //save the selected members
    localStorage.setItem(
      'selectedMembersWithRole',
      JSON.stringify(this.selectedMembersWithRoles)
    );
  };

  restoreForm = () => {
    //only try to restore form if loadDataForEditCommitteePage = false
    if (this.isEditPage()) return;

    //restore the form except for the coordinator
    const savedForm = localStorage.getItem('createCommitteeForm');
    if (savedForm) {
      try {
        const parsedData = JSON.parse(savedForm);
        this.committeeFormGroup.patchValue(parsedData);
      } catch (err) {
        console.error('Error parsing saved form data:', err);
      }
    }
  };
}
