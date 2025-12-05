import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  effect,
  ElementRef,
  input,
  OnInit,
  output,
  viewChild,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Fuse from 'fuse.js';
import { Subscription, debounceTime } from 'rxjs';
import { BACKEND_URL } from '../../../global_constants';
import {
  MemberSearchResult,
  MeetingCreationDto,
  MeetingFormData,
  AgendaDto,
  DecisionDto,
} from '../../models/models';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafeCloseDialogCustom } from '../../utils/safe-close-dialog-custom.directive';
import { Response } from '../../response/response';

@Component({
  selector: 'app-meeting-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SafeCloseDialogCustom,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    RouterLink,
  ],
  templateUrl: './meeting-form.component.html',
  styleUrl: './meeting-form.component.scss',
})
export class MeetingForm implements OnInit {
  //outputs
  formSaveEvent = output<MeetingCreationDto>();

  //inputs
  isEditPage = input.required<boolean>();
  meetingFormData = input.required<MeetingFormData>();

  /////////////////////////////////////////////
  //Form control initalization with @Input data for left and right panel

  selectInviteeFormGroup = new FormGroup({
    searchBarInput: new FormControl(''),
  });

  //alias for this.meetingFormGroup().controls
  committeeSearch!: FormControl<string>;
  title!: FormControl<string>;
  heldDate!: FormControl<string>;
  heldTime!: FormControl<string>;
  heldPlace!: FormControl<string>;

  meetingFormGroup!: FormGroup<{
    title: FormControl<string>;
    heldDate: FormControl<string>;
    heldTime: FormControl<string>;
    heldPlace: FormControl<string>;
  }>;

  //for agenda and decision we will use two way binding as the input should be associated with DecisionDto not a string(as id is needed for edit page);
  agendas!: AgendaDto[];
  decisions!: DecisionDto[];

  ngOnInit(): void {
    //initializing the form groups and controls for both right and left panel
    this.committeeSearch = new FormControl('', {
      nonNullable: true,
    });

    this.title = new FormControl(this.meetingFormData().title, {
      nonNullable: true,
    });

    this.heldDate = new FormControl(this.meetingFormData().heldDate, {
      nonNullable: true,
    });

    this.heldTime = new FormControl(this.meetingFormData().heldTime, {
      nonNullable: true,
    });

    this.heldPlace = new FormControl(this.meetingFormData().heldPlace, {
      nonNullable: true,
    });

    this.decisions = this.meetingFormData().decisions;
    this.agendas = this.meetingFormData().agendas;

    this.meetingFormGroup = new FormGroup({
      title: this.title,
      heldDate: this.heldDate,
      heldTime: this.heldTime,
      heldPlace: this.heldPlace,
    });

    this.possibleInvitees = this.meetingFormData().possibleInvitees;
    this.displayedPossibleInvitees = this.possibleInvitees;
    this.selectedInvitees = this.meetingFormData().selectedInvitees;
    this.hasInviteeDataLoaded = true;

    this.setupObservableForInviteeSearchBarInputChange();
    this.setupObservableForCommitteeSearchBarInputChange();
  }

  //////////////////////////////////////////////
  //this variable is used for mobile view styling
  isMeetingDetailsPart = true;

  //---------------------------------LEFT PANEL-----------------------------

  //variables
  invitteeSearchInputFieldSubscription!: Subscription;
  possibleInvitees: MemberSearchResult[] = [];
  selectedInvitees: MemberSearchResult[] = [];
  displayedPossibleInvitees: MemberSearchResult[] = [];

  constructor(private router: Router, private httpClient: HttpClient) {
    //open dialog
    effect(() => {
      this.diag()!.nativeElement.showModal();
    });

    //load data for right panel
    this.httpClient
      .get<Response<{ committeeId: number; committeeName: string }[]>>(
        BACKEND_URL + '/api/getMyActiveCommitteeNamesAndIds',
        { withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          console.log(response.mainBody);
          response.mainBody.forEach((committeeIdAndName) =>
            this.committeeIdsAndNames.push({
              committeeId: committeeIdAndName.committeeId,
              committeeName: committeeIdAndName.committeeName,
            })
          );
          this.displayedCommitteeIdsAndNames = this.committeeIdsAndNames;
          console.log(this.displayedCommitteeIdsAndNames);
        },
      });
  }

  onInviteeSelect(selectedInvitee: MemberSearchResult) {
    this.selectedInvitees.push(selectedInvitee);
    this.possibleInvitees = this.possibleInvitees.filter(
      (possibleInvitee) => possibleInvitee.memberId !== selectedInvitee.memberId
    );
    this.displayedPossibleInvitees = this.possibleInvitees;
  }

  setupObservableForInviteeSearchBarInputChange() {
    this.invitteeSearchInputFieldSubscription =
      this.selectInviteeFormGroup.controls.searchBarInput.valueChanges
        .pipe(debounceTime(500)) // wait 0.5 seconds after user stops typing

        .subscribe((value) => {
          console.log('searching');
          if (value === '') {
            this.displayedPossibleInvitees = this.possibleInvitees;
          } else {
            this.displayedPossibleInvitees = this.fuzzySearchPossibleInvitees(
              value as string
            );
          }
        });
  }

  fuzzySearchPossibleInvitees(query: string): MemberSearchResult[] {
    const fuse = new Fuse(this.possibleInvitees, {
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

  //---------------------------------RIGHT PANEL-----------------------------

  //variables
  FORM_NAME = 'create_meeting_form';
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_meeting_dialogue');

  showDropdown = false;

  selectedCommitteeId!: number;
  committeeSearchSubscription!: Subscription;
  @ViewChild('meetingCreationForm') private scrollContainer!: ElementRef;
  committeeIdsAndNames: { committeeId: number; committeeName: string }[] = [];
  displayedCommitteeIdsAndNames: {
    committeeId: number;
    committeeName: string;
  }[] = [];

  setupObservableForCommitteeSearchBarInputChange() {
    this.committeeSearchSubscription = this.committeeSearch.valueChanges
      .pipe(debounceTime(250))
      .subscribe((value) => {
        console.log('searching');

        if (value === '') {
          this.displayedCommitteeIdsAndNames = this.committeeIdsAndNames;
        } else {
          this.displayedCommitteeIdsAndNames = this.fuzzySearchCommittee(
            value as string
          );
        }
      });
  }

  //if a committee is already selected, and again 'Select Committee' is clicked, all possible committees are displayed
  onFocus() {
    this.displayedCommitteeIdsAndNames = this.committeeIdsAndNames;
  }

  fuzzySearchCommittee(
    query: string
  ): { committeeId: number; committeeName: string }[] {
    const fuse = new Fuse(Array.from(this.committeeIdsAndNames.values()), {
      keys: ['committeeName'],
      threshold: 0.3,
    });
    return fuse
      .search(query)
      .map((result) => result.item)
      .sort(this.committeeSortingFunction);
  }

  private committeeSortingFunction = (
    committee1: { committeeId: number; committeeName: string },
    committee2: { committeeId: number; committeeName: string }
  ) => committee1.committeeName.localeCompare(committee2.committeeName);

  //to use in template to make sure invitee has been displayed before displaying: No possible invitees
  hasInviteeDataLoaded = false;

  // Handle option selection
  //when isEditPage = true, the committeeSelection dropdown is disabled and data is never loaded with an api call to the backend, instead, the data is prefilled from the @Input meetingFormData
  onCommitteeSelection(committeeIdAndName: {
    committeeId: number;
    committeeName: string;
  }): void {
    this.committeeSearch.setValue(committeeIdAndName.committeeName);
    this.selectedCommitteeId = committeeIdAndName.committeeId;
    this.showDropdown = false;

    //reset displayedCommitteeIdsAndNames
    this.displayedCommitteeIdsAndNames = this.committeeIdsAndNames;

    //clear the invitees variables first
    this.possibleInvitees = [];
    this.displayedPossibleInvitees = [];
    this.selectedInvitees = [];

    this.hasInviteeDataLoaded = false;

    //load the possible invitees
    this.httpClient
      .get<Response<MemberSearchResult[]>>(
        BACKEND_URL + '/api/getPossibleInvitees',
        {
          params: new HttpParams().set('committeeId', this.selectedCommitteeId),
          withCredentials: true,
        }
      )
      .subscribe({
        next: (response) => {
          this.possibleInvitees = response.mainBody;
          this.displayedPossibleInvitees = this.possibleInvitees;
          console.log(this.displayedPossibleInvitees);
          this.hasInviteeDataLoaded = true;
        },
        error: (response) => {
          console.log(response);
          //TODO: handle error with popup message
        },
      });
  }

  redirectToCreateCommittee() {
    this.router.navigate(['/home/create-committee']);
  }

  onSubmit($event: Event) {
    $event.preventDefault();
    const requestBody = new MeetingCreationDto();
    requestBody.committeeId = this.selectedCommitteeId;
    requestBody.title = this.title.value;
    requestBody.heldPlace = this.heldPlace.value;
    requestBody.heldDate = this.heldDate.value;
    requestBody.heldTime = this.heldTime.value;
    requestBody.agendas = this.agendas;
    requestBody.decisions = this.decisions;

    requestBody.inviteeIds = this.selectedInvitees.map(
      (invitee) => invitee.memberId
    );

    this.formSaveEvent.emit(requestBody);
    localStorage.removeItem(this.FORM_NAME);
  }

  count = -1; //unique negative number which is assigned as the decision or agenda id which is used for deletion
  createEmptyAgenda() {
    const newAgenda = new AgendaDto();
    newAgenda.agendaId = this.count;
    this.count--;
    this.agendas.push(newAgenda);
  }

  createEmptyDecision() {
    const newDecision = new DecisionDto();
    newDecision.decisionId = this.count;
    this.count--;
    this.decisions.push(newDecision);
    this.scrollToBottom();
  }

  deleteAgenda(agendaId: number) {
    console.log("delete agenda executed");
    this.agendas = this.agendas.filter(
      (agenda) => agenda.agendaId !== agendaId
    );
  }

  deleteDecision(decisionId: number) {
    this.decisions = this.decisions.filter(
      (decision) => decision.decisionId !== decisionId
    );
  }

  //always scroll the container to the bottom, when new decision is added
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  saveFormData = () => {
    if (this.isEditPage()) return;

    const formValue = this.meetingFormGroup.getRawValue();

    // Check if at least one field has some value
    const hasData = Object.values(formValue).some(
      (value) => value !== null && value !== undefined && value !== ''
    );

    if (!hasData) {
      return;
    }

    localStorage.setItem(this.FORM_NAME, JSON.stringify(formValue));
  };

  restoreFormData = () => {
    if (this.isEditPage()) return;

    //restore form normally ie restores the FormGroup
    const savedData = localStorage.getItem(this.FORM_NAME);
    if (savedData) {
      console.log('Found the saved Data');
      console.log(savedData);
      try {
        const parsedData = JSON.parse(savedData);
        this.meetingFormGroup.patchValue(parsedData); // prefill the form

        //the above patchValue does not restore the FormArrays, so manually restoring agendas and decisions

        //TODO: manually restore agendas and decisions

        // if (parsedData['agendas'] && parsedData['agendas'].length > 0) {
        //   (parsedData['agendas'] as Array<string>).forEach((agenda) => {
        //     (this.meetingFormGroup.controls['agendas'] as FormArray).push(
        //       new FormControl(agenda),
        //     );
        //   });
        // }

        // if (parsedData['decisions'] && parsedData['decisions'].length > 0) {
        //   (parsedData['decisions'] as Array<string>).forEach((decision) => {
        //     (this.meetingFormGroup.controls['decisions'] as FormArray).push(
        //       new FormControl(decision),
        //     );
        //   });
        // }
      } catch (err) {
        console.error('Failed to parse saved form data', err);
      }
    }
  };

  ngOnDestroy() {
    console.log('DEBUG: create-committee component destroyed');
    this.committeeSearchSubscription.unsubscribe();
    this.invitteeSearchInputFieldSubscription.unsubscribe();
  }
}
