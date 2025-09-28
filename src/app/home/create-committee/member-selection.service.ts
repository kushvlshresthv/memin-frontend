import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MemberService } from '../../members-service.service';
import { MemberSearchResult } from '../../models/models';
import Fuse from 'fuse.js';
import { query } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import fuse from 'fuse.js';
import rn from '@angular/common/locales/rn';

@Injectable({
  providedIn: 'root',
})
export class MemberSelectionService {
  memberService = inject(MemberService);
  httpClient = inject(HttpClient);

  private unselectedMembers: MemberSearchResult[] = [];
  private searchedMembers: MemberSearchResult[] = [];
  private selectedMembersWithRoles: {
    member: MemberSearchResult;
    role: string;
  }[] = [];

  //to convey the components that user has been loaded
  private usersSubject = new BehaviorSubject<MemberSearchResult[]>([]);
  public loadingUsers$ = this.usersSubject.asObservable();

  constructor() {
    this.memberService.loadAllMembers().subscribe({
      next: (response) => {
        this.unselectedMembers = response;
        this.searchedMembers = response;
        this.usersSubject.next(this.unselectedMembers);
      },
      error: (error) => {
        console.log('TODO: show in popup' + error);
      },
    });
  }

  removeMemberFromUnselectedMembers(memberToRemove: MemberSearchResult) {
    this.unselectedMembers = this.unselectedMembers.filter(
      (member) => member.memberId != memberToRemove.memberId,
    );
  }

  removeMemberFromSearchedMembers(memberToRemove: MemberSearchResult) {
    this.searchedMembers = this.searchedMembers.filter(
      (member) => member.memberId != memberToRemove.memberId,
    );
  }

  addMemberToUnselectedMembers(memberToAdd: MemberSearchResult) {
    this.unselectedMembers = [...this.unselectedMembers, memberToAdd];
  }

  addMemberToSearchedMembers(memberToAdd: MemberSearchResult) {
    this.searchedMembers = [...this.searchedMembers, memberToAdd];
  }

  addMemberToSelectedMembersWithRoles(
    selectedMember: MemberSearchResult,
    role: string,
  ) {
    this.selectedMembersWithRoles.push({
      member: selectedMember,
      role: role,
    });
  }

  updateRoleOfSelectedMember(
    memberToBeUpdated: MemberSearchResult,
    newRole: string,
  ) {
    const memberToBeUpdatedWithRole = this.selectedMembersWithRoles.find(
      (memberWithRole) =>
        memberWithRole.member.memberId == memberToBeUpdated.memberId,
    );
    memberToBeUpdatedWithRole!.role = newRole;
  }

  unselected() {
    return this.unselectedMembers.sort(this.memberSortingFunction);
  }

  private memberSortingFunction = (
    member1: MemberSearchResult,
    member2: MemberSearchResult,
  ) => member1.firstName.localeCompare(member2.firstName);

  searched() {
    return this.searchedMembers.sort(this.memberSortingFunction);
  }

  selectedWithRoles() {
    return this.selectedMembersWithRoles;
  }

  selected() {
    return this.selectedMembersWithRoles.map(
      (memberWithRole) => memberWithRole.member,
    );
  }

  setSearched(newSearchedMembers: MemberSearchResult[]) {
    this.searchedMembers = newSearchedMembers;
  }

  fuzzySearchUnselectedMembers(query: string): MemberSearchResult[] {
    const fuse = new Fuse(this.unselectedMembers, {
      keys: ['firstName', 'lastName'],
      threshold: 0.3, // lower = stricter match
    });
    return fuse
      .search(query)
      .map((result) => result.item)
      .sort(this.memberSortingFunction);
  }
}
