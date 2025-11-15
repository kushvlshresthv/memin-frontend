import { Component, effect, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { MinuteComponent } from '../../committee-details/minute/minute.component';
import { MinuteDataService } from '../../committee-details/minute/minute-data.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import { MemberSearchResult, CommitteeCreationDto, MeetingCreationDto } from '../../models/models';
import { MemberSelectionService } from '../create-committee/select-member-for-committee/select-member-for-committee.service';
import { SelectInviteeForMeetingComponent } from './select-invitee-for-meeting/select-invitee-for-meeting.component';
import { SafeCloseDialog } from '../../utils/safe-close-dialog.directive';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [ReactiveFormsModule, SelectInviteeForMeetingComponent, SafeCloseDialog],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.scss',
  providers: []
})
export class CreateMeetingComponent {

  FORM_NAME = 'create_meeting_form';
  diag = viewChild<ElementRef<HTMLDialogElement>>('new_meeting_dialogue');

  meetingCreation = new MeetingCreationDto();



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

  ngOnDestroy() {
    console.log('DEBUG: create-committee component destroyed');
  }
}
