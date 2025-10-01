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
import id from '@angular/common/locales/id';
import { MemberSelectionService } from './select-member-for-committee.service';

@Component({
  selector: 'app-select-member-for-committee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-member-for-committee.component.html',
  styleUrl: './select-member-for-committee.component.scss',
})
export class SelectMemberForCommitteeComponent {
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
  }

  setupObservableForMemberLoadComplete() {
    this.memberSelectionService.loadingUsers$.subscribe((unselectedMembers) => {
      unselectedMembers.forEach((member) => {
        this.memberAndFormControlMap.set(
          member.memberId,
          new FormControl('Add', { nonNullable: true }),
        );
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
}
