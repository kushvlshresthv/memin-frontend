import {
  Component,
  effect,
  ElementRef,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import {
  MeetingCreationDto,
  MeetingSummaryDto,
  MemberSearchResult,
} from '../../models/models';
import { SafeCloseDialogCustom } from '../../utils/safe-close-dialog-custom.directive';
import { Response } from '../../response/response';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import Fuse from 'fuse.js';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SafeCloseDialogCustom,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    RouterLink,
  ],

  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.scss',
})
export class CreateMeetingComponent implements OnInit {

  //////////////////////////////////////////////
  //this variable is used for mobile view styling
  isMeetingDetailsPart = true;





  //---------------------------------LEFT PANEL-----------------------------

  //variables
  invitteeSearchInputFieldSubscription!: Subscription;
  possibleInvitees: MemberSearchResult[] = [];
  selectedInvitees: MemberSearchResult[] = [];
  displayedPossibleInvitees: MemberSearchResult[] = [];

  selectInviteeFormGroup = new FormGroup({
    searchBarInput: new FormControl(''),
  });

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {
    //open dialog
    effect(() => {
      this.diag()!.nativeElement.showModal();
    });

    //load data for right panel
    this.httpClient
      .get<
        Response<{ committeeId: number; committeeName: string }[]>
      >(BACKEND_URL + '/api/getMyActiveCommitteeNamesAndIds', { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log(response.mainBody);
          response.mainBody.forEach((committeeIdAndName) =>
            this.committeeIdsAndNames.push({
              committeeId: committeeIdAndName.committeeId,
              committeeName: committeeIdAndName.committeeName,
            }),
          );
          this.displayedCommitteeIdsAndNames = this.committeeIdsAndNames;
          console.log(this.displayedCommitteeIdsAndNames);
        },
      });
  }

  onInviteeSelect(selectedInvitee: MemberSearchResult) {
    this.selectedInvitees.push(selectedInvitee);
    this.possibleInvitees = this.possibleInvitees.filter(
      (possibleInvitee) =>
        possibleInvitee.memberId !== selectedInvitee.memberId,
    );
    this.displayedPossibleInvitees = this.possibleInvitees;
  }

  ngOnInit(): void {
    this.setupObservableForInviteeSearchBarInputChange();
    this.setupObservableForCommitteeSearchBarInputChange();
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
              value as string,
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
    member2: MemberSearchResult,
  ) => member1.firstName.localeCompare(member2.firstName);

  //---------------------------------RIGHT PANEL-----------------------------

  //variables
  FORM_NAME = 'create_meeting_form';
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_meeting_dialogue');

  showDropdown = false;

  //form controls

  committeeSearch = new FormControl<string>('');
  title = new FormControl();
  heldDate = new FormControl();
  heldTime = new FormControl();
  heldPlace = new FormControl();
  decisions = new FormArray<FormControl>([]);
  agendas = new FormArray<FormControl>([]);

  createMeetingFormGroup = new FormGroup({
    title: this.title,
    heldDate: this.heldDate,
    heldTime: this.heldTime,
    heldPlace: this.heldPlace,
    agendas: this.agendas,
    decisions: this.decisions,
  });

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
            value as string,
          );
        }
      });
  }

  //if a committee is already selected, and again 'Select Committee' is clicked, all possible committees are displayed
  onFocus() {
    this.displayedCommitteeIdsAndNames = this. committeeIdsAndNames;
  }

  fuzzySearchCommittee(
    query: string,
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
    committee2: { committeeId: number; committeeName: string },
  ) => committee1.committeeName.localeCompare(committee2.committeeName);

  //to use in template to make sure invitee has been displayed before displaying: No possible invitees
  hasInviteeDataLoaded = false;

  // Handle option selection
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
      .get<
        Response<MemberSearchResult[]>
      >(BACKEND_URL + '/api/getPossibleInvitees', { params: new HttpParams().set('committeeId', this.selectedCommitteeId), withCredentials: true })
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
    requestBody.agendas = this.agendas.value;
    requestBody.decisions = this.decisions.value;

    requestBody.inviteeIds = this.selectedInvitees.map(
      (invitee) => invitee.memberId,
    );

    console.log(requestBody);

    this.httpClient
      .post<Response<MeetingSummaryDto>>(
        BACKEND_URL + '/api/createMeeting',
        requestBody,
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          localStorage.removeItem(this.FORM_NAME);
          this.router.navigate(['/home/my-committees']);
          console.log('TODO: show in popup' + response.message);
        },

        error: (error) => {
          console.log('TODO: show in popup' + error.error.message);
          //TODO: show popup and redirect to my-committees
        },
      });
  }

  public addDecision() {
    this.decisions.push(new FormControl());
    this.scrollToBottom();
  }

  public deleteDecision(index: number) {
    this.decisions.removeAt(index);
  }

  public addAgenda() {
    this.agendas.push(new FormControl());
  }

  public deleteAgenda(index: number) {
    this.agendas.removeAt(index);
  }

  //always scroll the container to the bottom, when new decision is added
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  saveFormData = () => {
    const formValue = this.createMeetingFormGroup.getRawValue();

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
      console.log('Found the saved Data');
      console.log(savedData);
      try {
        const parsedData = JSON.parse(savedData);
        this.createMeetingFormGroup.patchValue(parsedData); // prefill the form

        //the above patchValue does not restore the FormArrays, so manually restoring agendas and decisions
        if (parsedData['agendas'] && parsedData['agendas'].length > 0) {
          (parsedData['agendas'] as Array<string>).forEach((agenda) => {
            (this.createMeetingFormGroup.controls['agendas'] as FormArray).push(
              new FormControl(agenda),
            );
          });
        }

        if (parsedData['decisions'] && parsedData['decisions'].length > 0) {
          (parsedData['decisions'] as Array<string>).forEach((decision) => {
            (
              this.createMeetingFormGroup.controls['decisions'] as FormArray
            ).push(new FormControl(decision));
          });
        }
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
