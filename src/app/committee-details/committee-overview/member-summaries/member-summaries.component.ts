import { Component, input } from '@angular/core';
import { MemberOfCommitteeDto, MemberSummaryDto } from '../../../models/models';
import { MemberSummaryComponent } from './member-summary/member-summary.component';

@Component({
  selector: 'app-member-summaries',
  standalone: true,
  imports: [MemberSummaryComponent],
  templateUrl: './member-summaries.component.html',
  styleUrl: './member-summaries.component.scss'
})
export class MemberSummariesComponent {
  membersOfCommittee = input.required<MemberOfCommitteeDto[]>();
}
