
import {Injectable} from "@angular/core"
import { MemberSearchResult } from "../../../models/models";

@Injectable()
export class InviteeSelectionService {
  possibleInvitees: MemberSearchResult[] = [];
  selectedInvitees: MemberSearchResult[] = [];
  displayedMembers: MemberSearchResult[] = [];
  

  onInviteeSelect(selectedInvitee: MemberSearchResult) {
    this.selectedInvitees.push(selectedInvitee);
    this.possibleInvitees = this.possibleInvitees.filter(
      (possibleInvitee) =>
        possibleInvitee.memberId !== selectedInvitee.memberId,
    );
    this.displayedMembers = this.possibleInvitees;
  }


  setDisplayedMembers(target: MemberSearchResult[]) {
    this.displayedMembers = target;
  }

  getDisplayedMembers() {
    return this.displayedMembers;
  }

  setPossibleInvitees(target: MemberSearchResult[]) {
    this.possibleInvitees = target;
  }

  getPossibleInvitees() {
    return this.possibleInvitees;
  }

  getSelectedInvitees() {
    return this.selectedInvitees;
  }

}
