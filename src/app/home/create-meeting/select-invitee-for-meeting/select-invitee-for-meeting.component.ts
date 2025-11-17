import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, from } from 'rxjs';
import {
  CommitteeOverviewDto,
  MemberSearchResult,
} from '../../../models/models';
import { MemberSelectionService } from '../../create-committee/select-member-for-committee/select-member-for-committee.service';
import { LoadMemberService } from '../../../load-member.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BACKEND_URL } from '../../../../global_constants';
import { Response } from '../../../response/response';
import { Component, inject } from '@angular/core';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-select-invitee-for-meeting',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-invitee-for-meeting.component.html',
  styleUrl: './select-invitee-for-meeting.component.scss',
})
export class SelectInviteeForMeetingComponent {
  possibleInvitees: MemberSearchResult[] = [];
  selectedInvitees: MemberSearchResult[] = [];
  isUserSearching = false;
  displayedMembers: MemberSearchResult[] = [];

  searchInputFieldSubscription!: Subscription;

  formData = new FormGroup({
    searchBarInput: new FormControl(''),
  });

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((receivedParams) => {
      const params = new HttpParams().set(
        'committeeId',
        1 /*receivedParams['committeeId']*/,
      );
      this.httpClient
        .get<
          Response<MemberSearchResult[]>
        >(BACKEND_URL + '/api/getPossibleInvitees', { params: params, withCredentials: true })
        .subscribe({
          next: (response) => {
            this.possibleInvitees = response.mainBody;
            this.displayedMembers = this.possibleInvitees;
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
    this.possibleInvitees = this.possibleInvitees.filter(
      (possibleInvitee) =>
        possibleInvitee.memberId !== selectedInvitee.memberId,
    );
    this.displayedMembers = this.possibleInvitees;
  }

  ngOnInit(): void {
    this.setupObservableForSearchBarInputChange();
  }

  setupObservableForSearchBarInputChange() {
    this.searchInputFieldSubscription =
      this.formData.controls.searchBarInput.valueChanges
        .pipe(debounceTime(500)) // wait 0.5 seconds after user stops typing

        .subscribe((value) => {
          console.log('searching');
          if (value === '') {
            this.displayedMembers = this.possibleInvitees;
          } else {
            this.displayedMembers = this.fuzzySearchPossibleInvitees(
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

  ngOnDestroy(): void {
    this.searchInputFieldSubscription.unsubscribe();
  }
}
