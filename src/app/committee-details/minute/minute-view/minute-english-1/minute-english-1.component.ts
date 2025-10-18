import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MinuteDataDto } from '../../../../models/models';
import { MinuteDataService } from '../../minute-data.service';

@Component({
  selector: 'app-minute-english-1',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './minute-english-1.component.html',
  styleUrl: './minute-english-1.component.scss'
})
export class MinuteEnglish1Component {
  minuteData = input.required<MinuteDataDto>();
}
