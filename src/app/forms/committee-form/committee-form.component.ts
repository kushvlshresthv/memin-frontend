import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MemberSelectionService } from '../../home/create-committee/select-member-for-committee/select-member-for-committee.service';
import {
  MemberSearchResult,
  CommitteeCreationDto,
} from '../../models/models';
import { SelectMemberForCommitteeComponent } from '../../home/create-committee/select-member-for-committee/select-member-for-committee.component';
import { SafeCloseDialogCustom } from '../../utils/safe-close-dialog-custom.directive';

@Component({
  selector: 'app-committee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectMemberForCommitteeComponent,
    SafeCloseDialogCustom,
  ],
  templateUrl: './committee-form.component.html',
  styleUrl: './committee-form.component.scss',
})
export class CommitteeFormComponent {
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_project_dialogue');
  memberSelectionService = inject(MemberSelectionService);

  //inputs
  formData = input.required<FormGroup<CommitteeFromComponentFormGroup>>();
  isEditPage = input.required<boolean>();
  memberAndRoleFormControlMap = input.required<Map<number, FormControl<string>>>();

  //outputs
  formSaveEvent = output<CommitteeCreationDto>();


  //setting aliases for this.formData().controls
  name!: FormControl;
  description!: FormControl;
  coordinator!: FormControl;
  status!: FormControl;
  maxNoOfMeetings!: FormControl;
  minuteLanguage!: FormControl

  constructor() {
    effect(() => {
      this.diag()!.nativeElement.showModal();
    });
  }

  ngOnInit() {
    this.name = this.formData().controls.name;
    this.description = this.formData().controls.description;
    this.coordinator = this.formData().controls.coordinator;
    //if coordinator is loaded for edit page: 
    if(this.isEditPage()) {
      this.memberSelectionService.removeMemberFromUnselectedMembers(this.coordinator.value);
      this.currentCoordinator = this.coordinator.value;
    } 
    this.status = this.formData().controls.status;
    this.maxNoOfMeetings = this.formData().controls.maxNoOfMeetings;
    this.minuteLanguage = this.formData().controls.minuteLanguage;
  }

  // ngOnInit() {
  //   if (this.loadDataForEditCommitteePage()) {
  //     this.activatedRoute.queryParams.subscribe((receivedParams) => {
  //       const params = new HttpParams().set(
  //         'committeeId',
  //         receivedParams['committeeId'],
  //       );
  //       this.httpClient
  //         .get<
  //           Response<CommitteeDetailsForEditDto>
  //         >(BACKEND_URL + '/api/getCommitteeDetailsForEditPage', { params: params, withCredentials: true })
  //         .subscribe({
  //           next: (response) => {
  //             console.log('data loaded for edit page is: ');
  //             console.log(response);
  //             const committeeDetails = response.mainBody;
  //             this.name.setValue(committeeDetails.name);
  //             this.description.setValue(committeeDetails.description);
  //             this.status.setValue(committeeDetails.status);
  //             this.maxNoOfMeetings.setValue(committeeDetails.maxNoOfMeetings);
  //             this.minuteLanguage.setValue(committeeDetails.minuteLanguage);
  //             this.coordinator.setValue(committeeDetails.coordinator);
  //             //to synchronize coordinator selection
  //             this.onCoordinatorSelectionOrChange();

  //             committeeDetails.membersWithRoles.forEach((memberWithRole) => {
  //               this.memberSelectionService.addMemberToSelectedMembersWithRolesAndSync(
  //                 memberWithRole.member,
  //                 memberWithRole.role,
  //               );
  //             });
  //           },
  //         });
  //     });
  //   }
  // }

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
    console.log(this.memberSelectionService.selectedWithRoles());
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

    //set the members in this format:
    // {
    //   members: {
    //     1: 'Treasurer',
    //     2: 'Member',
    //     3: 'Member'
    //   }
    // }
    this.memberSelectionService
      .selectedWithRoles()
      .forEach((memberWithRole) => {
        committeeCreationDto.members[memberWithRole.member.memberId] =
          memberWithRole.role;
      });

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
    (this.formData() as any).removeControl('coordinator');
    localStorage.setItem(
      'createCommitteeForm',
      JSON.stringify(this.formData().getRawValue()),
    );

    //save the selected members
    localStorage.setItem(
      'selectedMembersWithRole',
      JSON.stringify(this.memberSelectionService.selectedWithRoles()),
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
        this.formData().patchValue(parsedData);
      } catch (err) {
        console.error('Error parsing saved form data:', err);
      }
    }
  };

  ngOnDestroy() {
    console.log('DEBUG: create-committee component destroyed');
  }
}

export interface CommitteeFromComponentFormGroup {
  name: FormControl;
  description: FormControl;
  coordinator: FormControl<MemberSearchResult>;
  status: FormControl<'ACTIVE' | 'INACTIVE'>;
  maxNoOfMeetings: FormControl;
  minuteLanguage: FormControl<'NEPALI' | 'ENGLISH' | null>;
}
