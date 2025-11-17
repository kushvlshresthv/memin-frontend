import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, from } from 'rxjs';
import { CommitteeOverviewDto, MemberSearchResult } from '../../../models/models';
import { MemberSelectionService } from '../../create-committee/select-member-for-committee/select-member-for-committee.service';
import { LoadMemberService } from '../../../load-member.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BACKEND_URL } from '../../../../global_constants';
import {Response} from "../../../response/response";
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-select-invitee-for-meeting',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-invitee-for-meeting.component.html',
  styleUrl: './select-invitee-for-meeting.component.scss'
})
export class SelectInviteeForMeetingComponent {

  possibleInvitees: MemberSearchResult[] = [];
  selectedInvitees: MemberSearchResult[] = [];

  searchInputFieldSubscription!: Subscription;

  formData = new FormGroup({
    searchBarInput: new FormControl(''),
  });


  constructor(private router: Router, private httpClient: HttpClient, private activatedRoute: ActivatedRoute) {


    this.activatedRoute.queryParams.subscribe((receivedParams) => {
      const params = new HttpParams().set('committeeId', 1/*receivedParams['committeeId']*/);
      this.httpClient
        .get<
          Response<MemberSearchResult[]>
        >(BACKEND_URL + '/api/getPossibleInvitees', { params: params, withCredentials: true })
        .subscribe({
          next: (response) => {
            this.possibleInvitees = response.mainBody;
          },
          error: (response) => {
            console.log(response);
            //TODO: handle error with popup message
          },
        });
    });
  }

  onUnselectedMemberClick(selectedInvitee: MemberSearchResult) {
    this.selectedInvitees.push(selectedInvitee);
    this.possibleInvitees = this.possibleInvitees.filter((possibleInvitee)=> possibleInvitee.memberId !== selectedInvitee.memberId)
    console.log(this.possibleInvitees);
  }


  ngOnInit(): void {
    this.setupObservableForSearchBarInputChange();
  }


  setupObservableForSearchBarInputChange() {
    //implement search
  }

  // ngOnDestroy(): void {
  //   this.searchInputFieldSubscription.unsubscribe();
  // }
}
