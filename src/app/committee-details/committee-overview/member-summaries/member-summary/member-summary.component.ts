import { Component, input } from '@angular/core';
import { MemberSummaryDto } from '../../../../models/models';

@Component({
  selector: 'app-member-summary',
  standalone: true,
  imports: [],
  templateUrl: './member-summary.component.html',
  styleUrl: './member-summary.component.scss'
})
export class MemberSummaryComponent {
  memberSummary = input.required<MemberSummaryDto>();
}
