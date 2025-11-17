import { Component, effect, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { MinuteComponent } from '../../committee-details/minute/minute.component';
import { MinuteDataService } from '../../committee-details/minute/minute-data.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import { MemberSearchResult, CommitteeCreationDto, MeetingCreationDto, MeetingSummaryDto } from '../../models/models';
import { MemberSelectionService } from '../create-committee/select-member-for-committee/select-member-for-committee.service';
import { SelectInviteeForMeetingComponent } from './select-invitee-for-meeting/select-invitee-for-meeting.component';
import { SafeCloseDialogCustom } from '../../utils/safe-close-dialog-custom.directive';
import {Response} from '../../response/response'
import { InviteeSelectionService } from './select-invitee-for-meeting/select-invitee-for-meeting.service';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [ReactiveFormsModule, SelectInviteeForMeetingComponent, SafeCloseDialogCustom],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.scss',
  providers: [InviteeSelectionService],
})
export class CreateMeetingComponent {
  FORM_NAME = 'create_meeting_form';
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_meeting_dialogue');
  inviteeSelectionService = inject(InviteeSelectionService);


  title = new FormControl();
  heldDate = new FormControl();
  heldTime = new FormControl();
  heldPlace = new FormControl();
  decisions = new FormArray<FormControl>([]);
  agendas = new FormArray<FormControl>([]);


  formData = new FormGroup({
    title: this.title,
    heldDate: this.heldDate,
    heldTime: this.heldTime,
    heldPlace: this.heldPlace,
    agendas: this.agendas,
    decisions: this.decisions,
  });

  @ViewChild('meetingCreationForm') private scrollContainer!: ElementRef;

  constructor(private httpClient: HttpClient, private router: Router) {
    effect(() => {
      this.diag()!.nativeElement.showModal();
    });
  }

  onSubmit($event: Event) {
    $event.preventDefault();
    const requestBody = new MeetingCreationDto();
    requestBody.title = this.title.value;
    requestBody.heldPlace = this.heldPlace.value;
    requestBody.heldDate = this.heldDate.value;
    requestBody.heldTime = this.heldTime.value;
    requestBody.agendas = this.agendas.value;
    requestBody.decisions = this.decisions.value;

    //TODO: fix the below, as it is not always 1
    requestBody.committeeId = 1; 

    requestBody.inviteeIds = this.inviteeSelectionService.getSelectedInvitees().map(invitee=>invitee.memberId)

    console.log(requestBody);

    this.httpClient.post<Response<MeetingSummaryDto>>(BACKEND_URL+'/api/createMeeting', requestBody, {
      withCredentials: true,
    }).subscribe({
      next: (response) => {
	console.log(response.message);
	localStorage.removeItem(this.FORM_NAME);
	this.router.navigate(['/home/my-committees']);
        console.log("TODO: show in popup" + response.message);
      },

      error: (error) => {
        console.log('TODO: show in popup' + error.error.message);
        //TODO: show popup and redirect to my-committees
      }
    });
  }

  public addDecision() {
    this.decisions.push(new FormControl());
    this.scrollToBottom();
  }

  public deleteDecision(index: number){
    this.decisions.removeAt(index);
  }


  public addAgenda() {
    this.agendas.push(new FormControl());
  }

  public deleteAgenda(index: number){
    this.agendas.removeAt(index);
  }


  //always scroll the container to the bottom, when new decision is added
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
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



  restoreFormData =  ()=> {
    //restore form normally ie restores the FormGroup
    const savedData = localStorage.getItem(this.FORM_NAME);
    if (savedData) {
      console.log("Found the saved Data");
      console.log(savedData);
      try {
        const parsedData = JSON.parse(savedData);
        this.formData.patchValue(parsedData); // prefill the form

        //the above patchValue does not restore the FormArrays, so manually restoring agendas and decisions
        if(parsedData['agendas'] && parsedData['agendas'].length > 0 ) {
          (parsedData['agendas'] as Array<string>).forEach((agenda) => {
            (this.formData.controls["agendas"] as FormArray).push(new FormControl(agenda));
          });
        }

        if(parsedData['decisions'] && parsedData['decisions'].length > 0 ) {
          (parsedData['decisions'] as Array<string>).forEach((decision) => {
            (this.formData.controls["decisions"] as FormArray).push(new FormControl(decision));
          });
        }
      } catch (err) {
        console.error('Failed to parse saved form data', err);
      }
    }
  }

  ngOnDestroy() {
    console.log('DEBUG: create-committee component destroyed');
  }
}
