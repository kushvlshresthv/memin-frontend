import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MinuteDataDto } from '../../../../models/models';
import { MinuteDataService } from '../../minute-data.service';
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
