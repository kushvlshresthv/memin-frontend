import { Component } from "@angular/core";
import { BACKEND_URL } from "../../../global_constants";
import { MeetingCreationDto, MeetingFormData, MeetingSummaryDto } from "../../models/models";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Response } from "../../response/response"
import { MeetingForm } from "../../forms/meeting-form/meeting-form.component";

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [MeetingForm],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.scss',
})
export class CreateMeetingComponent  {

  constructor(private httpClient: HttpClient,private router: Router) {
    
  }


  meetingFormData: MeetingFormData = {
    meetingId: -1,
    committeeId: -1, 
    title: '',
    committeeName:'',
    heldDate: '',
    heldTime: '',
    heldPlace: '',
    decisions: [],
    agendas: [],
    possibleInvitees: [],
    selectedInvitees: [],
  }


  onFormSave(requestBody: MeetingCreationDto) {

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
          this.router.navigate(['/home/my-committees']);
          console.log('TODO: show in popup' + response.message);
        },

        error: (error) => {
          console.log('TODO: show in popup' + error.error.message);
          //TODO: show popup and redirect to my-committees
        },
      });
  }
  
} 
