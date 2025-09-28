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
import { MemberSelectionService } from '../member-selection.service';
import id from '@angular/common/locales/id';

@Component({
  selector: 'app-select-member-for-committee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-member-for-committee.component.html',
  styleUrl: './select-member-for-committee.component.scss',
})
export class SelectMemberForCommitteeComponent {
  router = inject(Router);
  selectionService = inject(MemberSelectionService);

  searchInputFieldSubscription!: Subscription;

  formData = new FormGroup({
    searchBarInput: new FormControl(''),
  });

  memberRolesMap = new Map<number, FormControl<string>>();

  ngOnInit(): void {
    this.setupObservableForSearchBarInputChange();
    this.setupObservableForMemberLoadComplete();
  }

  setupObservableForMemberLoadComplete() {
    this.selectionService.loadingUsers$.subscribe((unselectedMembers) => {
      unselectedMembers.forEach((member) => {
        this.memberRolesMap.set(
          member.memberId,
          new FormControl('', { nonNullable: true }),
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
            this.selectionService.setSearched(
              this.selectionService.unselected(),
            );
          } else {
            this.selectionService.setSearched(
              this.selectionService.fuzzySearchUnselectedMembers(
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
    this.selectionService.removeMemberFromUnselectedMembers(selectedMember);
    this.selectionService.removeMemberFromSearchedMembers(selectedMember);
    const role = this.memberRolesMap.get(selectedMember.memberId)!.value;
    this.selectionService.addMemberToSelectedMembersWithRoles(
      selectedMember,
      role,
    );
  }

  onRoleChange(member: MemberSearchResult): void {
    this.selectionService.updateRoleOfSelectedMember(
      member,
      this.memberRolesMap.get(member.memberId)!.value,
    );
  }
}
