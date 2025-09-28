import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MemberService } from '../../members-service.service';
import { MemberSearchResult } from '../../models/models';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class MemberSelectionService {
  memberService = inject(MemberService);
  httpClient = inject(HttpClient);

  committeeUnselectedMembers: MemberSearchResult[] = [];
  committeeSearchedMembers: MemberSearchResult[] = [];
  committeeSelectedMembersWithRoles: {
    member: MemberSearchResult;
    role: string;
  }[] = [];

  loadAllMembersAndSetFormControlForRoles() {
    this.memberService.loadAllMembers().subscribe({
      next: (response) => {
        this.committeeUnselectedMembers = response;

        this.committeeSearchedMembers = response;

        this.allMembers.forEach((member) => {
          this.memberRolesMap.set(
            member.memberId,
            new FormControl('', { nonNullable: true }),
          );
        });
      },
      error: (error) => {
        console.log('TODO: show in popup' + error);
      },
      complete: () => {
        console.log('DON' + this.searchedMembers);
      },
    });
  }
}
