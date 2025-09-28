import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import { MemberService } from '../../../members-service.service';
import { MemberSearchResult } from '../../../models/models';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import Fuse from 'fuse.js';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTabLabelWrapper } from '@angular/material/tabs';

@Component({
  selector: 'app-select-member-for-committee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-member-for-committee.component.html',
  styleUrl: './select-member-for-committee.component.scss',
})
export class SelectMemberForCommitteeComponent {
  memberService = inject(MemberService);
  httpClient = inject(HttpClient);
  router = inject(Router);

  allMembers!: MemberSearchResult[];
  searchedMembers = new Array<MemberSearchResult>();
  selectedMembersWithRole = new Array<{
    member: MemberSearchResult;
    role: string;
  }>();

  searchInputFieldSubscription!: Subscription;

  formData = new FormGroup({
    searchBarInput: new FormControl(''),
  });

  memberRolesMap = new Map<number, FormControl<string>>();

  ngOnInit(): void {
    this.setupObservableForSearchBarInputChange();
    this.loadAllMembersAndSetFormControlForRoles();
  }

  setupObservableForSearchBarInputChange() {
    this.searchInputFieldSubscription =
      this.formData.controls.searchBarInput.valueChanges
        .pipe(debounceTime(500)) // wait 0.5 seconds after user stops typing
        .subscribe((value) => {
          console.log('searching');
          if (value === '') {
            this.searchedMembers = this.allMembers;
          } else {
            this.searchedMembers = this.fuzzySearch(
              this.allMembers,
              value as string,
            );
          }
        });
  }

  loadAllMembersAndSetFormControlForRoles() {
    this.memberService.loadAllMembers().subscribe({
      next: (response) => {
        this.allMembers = response;

        this.searchedMembers = response;

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

  fuzzySearch(
    users: MemberSearchResult[],
    query: string,
  ): MemberSearchResult[] {
    const fuse = new Fuse(users, {
      keys: ['firstName', 'lastName'],
      threshold: 0.3, // lower = stricter match
    });
    return fuse.search(query).map((result) => result.item);
  }

  ngOnDestroy(): void {
    this.searchInputFieldSubscription.unsubscribe();
  }

  onRoleSelect(selectedMember: MemberSearchResult) {
    //remove it from all Members and searched Members
    this.allMembers = this.allMembers.filter(
      (member) => member.memberId != selectedMember.memberId,
    );

    this.searchedMembers = this.searchedMembers.filter(
      (member) => member.memberId != selectedMember.memberId,
    );

    this.selectedMembersWithRole.push({
      member: selectedMember,
      role: this.memberRolesMap.get(selectedMember.memberId)!.value,
    });
  }

  onRoleChange(member: MemberSearchResult): void {
    const memberWithRole = this.selectedMembersWithRole.find(
      (memberWithRole) => memberWithRole.member.memberId == member.memberId,
    );

    const newRole = this.memberRolesMap.get(member.memberId)!.value;
    memberWithRole!.role = newRole;
  }
}
