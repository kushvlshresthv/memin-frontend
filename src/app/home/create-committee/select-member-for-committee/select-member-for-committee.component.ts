import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import { MemberSearchResult } from '../../../models/models';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import Fuse from 'fuse.js';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTabLabelWrapper } from '@angular/material/tabs';
import id from '@angular/common/locales/id';
import { MemberSelectionService } from './select-member-for-committee.service';

@Component({
  selector: 'app-select-member-for-committee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-member-for-committee.component.html',
  styleUrl: './select-member-for-committee.component.scss',
})
export class SelectMemberForCommitteeComponent implements OnInit {
  router = inject(Router);
  memberSelectionService = inject(MemberSelectionService);

  searchInputFieldSubscription!: Subscription;

  formData = new FormGroup({
    searchBarInput: new FormControl(''),
  });

  memberAndFormControlMap = new Map<number, FormControl<string>>();

  ngOnInit(): void {
    this.setupObservableForSearchBarInputChange();
    this.setupObservableForMemberLoadComplete();
    this.restoreSelectedMembersFromLocalStorage();

  }

  setupObservableForMemberLoadComplete() {
    this.memberSelectionService.loadingUsers$.subscribe((unselectedMembers) => {
      unselectedMembers.forEach((member) => {
        if(!this.memberAndFormControlMap.has(member.memberId)){
        this.memberAndFormControlMap.set(
          member.memberId,
          new FormControl('Add', { nonNullable: true }),
        );
        }
      });
    });
  }

  setupObservableForSearchBarInputChange() {
    this.searchInputFieldSubscription =
      this.formData.controls.searchBarInput.valueChanges
        .pipe(debounceTime(500)) // wait 0.5 seconds after user stops typing
        .subscribe((value) => {
          console.log('searching');
          if (value === '') {
            this.memberSelectionService.setDisplayed(
              this.memberSelectionService.unselected(),
            );
          } else {
            this.memberSelectionService.setDisplayed(
              this.memberSelectionService.fuzzySearchUnselectedMembers(
                value as string,
              ),
            );
          }
        });
  }

  ngOnDestroy(): void {
    this.searchInputFieldSubscription.unsubscribe();
    console.log("DEBUG: select-member-for-committee component destroyed");
  }

  onRoleSelect(selectedMember: MemberSearchResult) {
    this.memberSelectionService.removeMemberFromUnselectedMembers(
      selectedMember,
    );
    this.memberSelectionService.removeMemberFromDisplayedMembers(selectedMember);
    const role = this.memberAndFormControlMap.get(selectedMember.memberId)!.value;
    this.memberSelectionService.addMemberToSelectedMembersWithRoles(
      selectedMember,
      role,
    );
  }

  onRoleChange(member: MemberSearchResult): void {
    if(this.memberAndFormControlMap.get(member.memberId)!.value === 'remove') {
      this.memberSelectionService.addMemberToUnselectedMembers(member);
      this.memberSelectionService.addMemberToDisplayedMembers(member);
      this.memberSelectionService.removeMemberFromSelectedMembersWithRoles(member);
      this.memberAndFormControlMap.get(member.memberId)!.setValue('Add');
    }

    this.memberSelectionService.updateRoleOfSelectedMember(
      member,
      this.memberAndFormControlMap.get(member.memberId)!.value,
    );
  }


  restoreSelectedMembersFromLocalStorage(): void {
    //restore the selected members and remove them from the unselected list
    const savedSelectedMembers = localStorage.getItem('selectedMembersWithRole');
    if (savedSelectedMembers) {
      try {

        const selectedMembersWithRoles: {member: MemberSearchResult, role: string}[] =
          JSON.parse(savedSelectedMembers);

        //for the saved selected members:
        //1. add them to the selected members list
        //2. restore the form control value for their role
        //3. remove them from the unselected members list and displayed members list

        selectedMembersWithRoles.forEach((memberWithRole) => {
            this.memberSelectionService.addMemberToSelectedMembersWithRoles(
            memberWithRole.member, memberWithRole.role);
            this.memberAndFormControlMap.set(memberWithRole.member.memberId, new FormControl(memberWithRole.role, { nonNullable: true }));
            this.memberSelectionService.removeMemberFromUnselectedMembers(memberWithRole.member);
            this.memberSelectionService.removeMemberFromDisplayedMembers(memberWithRole.member);
          });
      } catch (err) {
        console.error('Error parsing saved selected members data:', err);
      }
    }
  }
}
