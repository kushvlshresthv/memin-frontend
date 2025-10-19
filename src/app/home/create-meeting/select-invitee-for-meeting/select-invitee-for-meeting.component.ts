import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, debounceTime, from } from 'rxjs';
import { MemberSearchResult } from '../../../models/models';
import { MemberSelectionService } from '../../create-committee/select-member-for-committee/select-member-for-committee.service';
import { LoadMemberService } from '../../../load-member.service';
import { HttpClient } from '@angular/common/http';
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

  memberAndFormControlMap = new Map<number, FormControl<string>>();

  constructor(private router: Router, private httpClient: HttpClient) {
    // httpClient.get<Response<MemberSearchResult>>(BACKEND_URL + '/getPossibleInvitees').subscribe(
    //   {
    //     next: (response) => {
    //       const members = response.data;
    //     }
    // });

    this.possibleInvitees.push({
      memberId: 1,
      firstName: 'John',
      lastName: 'Doe',
      post: 'Professor',
      institution: 'University A'
    });
    this.possibleInvitees.push({
      memberId: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      post: 'Researcher',
      institution: 'Institute B'
    })
    this.possibleInvitees.push({
      memberId: 3,
      firstName: 'Alice',
      lastName: 'Johnson',
      post: 'Lecturer',
      institution: 'College C'
    })
  }


  ngOnInit(): void {
    this.setupObservableForSearchBarInputChange();
  }


  setupObservableForSearchBarInputChange() {
    //implement search
  }

  ngOnDestroy(): void {
    this.searchInputFieldSubscription.unsubscribe();
  }
}
