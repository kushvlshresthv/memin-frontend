import { Component, input } from '@angular/core';
import { MinuteDataDto } from '../../../../../../models/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-minute-nepali-1',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './minute-nepali-1.component.html',
  styleUrl: './minute-nepali-1.component.scss'
})
export class MinuteNepali1Component {
  minuteData = input.required<MinuteDataDto>();
}
