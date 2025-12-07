import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BACKEND_URL } from '../../../../../global_constants';
import { MeetingCreationDto, MeetingDetailsForEdit, MeetingFormData } from '../../../../models/models';
import { Response } from '../../../../response/response'
import { MeetingForm } from '../../../../forms/meeting-form/meeting-form.component';

@Component({
  selector: 'app-edit-meeting',
  standalone: true,
  imports: [MeetingForm],
  templateUrl: './edit-meeting.component.html',
  styleUrl: './edit-meeting.component.scss',
})
export class EditMeetingComponent implements OnInit {
  meetingFormData!: MeetingFormData;
  hasMemberFormDataLoaded = false;

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const meetingId = params['meetingId'];
      const committeeId = params['committeeId'];
      const httpParams = new HttpParams().set('meetingId', meetingId).set("committeeId", committeeId);
      this.httpClient
        .get<
          Response<MeetingDetailsForEdit>
        >(BACKEND_URL + '/api/getMeetingDetailsForEdit', { withCredentials: true, params: httpParams })
        .subscribe({
	  next: (response) => {
	    const meetingDetails = response.mainBody;
	    console.log(meetingDetails);
	    this.meetingFormData = {
	      title: meetingDetails.title,
	      heldDate: meetingDetails.heldDate,
	      heldTime: meetingDetails.heldTime,
	      heldPlace: meetingDetails.heldPlace,
	      decisions: meetingDetails.decisions,
	      agendas: meetingDetails.agendas,
	      selectedInvitees: meetingDetails.selectedInvitees,
	      possibleInvitees: meetingDetails.possibleInvitees,
	    }
	    this.hasMemberFormDataLoaded = true;
	  },
	  error: (error) => {
	    console.log("TODO: show error message");
	  }
	});
    });
  }


  onFormSave(responseBody: MeetingCreationDto) {
  }
}
