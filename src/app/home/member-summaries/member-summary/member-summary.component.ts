import { Component, input } from '@angular/core';
import { MemberDetailsDto } from '../../../models/models';

@Component({
  selector: 'app-member-summary',
  standalone: true,
  imports: [],
  templateUrl: './member-summary.component.html',
  styleUrl: './member-summary.component.scss'
})
export class MemberSummaryComponent {
  memberDetail = input.required<MemberDetailsDto>();
}
