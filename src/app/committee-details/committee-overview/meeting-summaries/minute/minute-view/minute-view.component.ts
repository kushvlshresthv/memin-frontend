import { Component, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { MinuteDataDto } from '../../../../../models/models';
import { DatePipe } from '@angular/common';
import { MinuteNepali1Component } from './minute-nepali-1/minute-nepali-1.component';
import { MinuteEnglish1Component } from './minute-english-1/minute-english-1.component';

@Component({
  selector: 'app-minute-view',
  standalone: true,
  imports: [DatePipe, MinuteNepali1Component, MinuteEnglish1Component],
  templateUrl: './minute-view.component.html',
  styleUrl: './minute-view.component.scss'
})
export class MinuteViewComponent {
  minuteData = input.required<MinuteDataDto>();
}
