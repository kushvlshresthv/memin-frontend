import { Component, inject, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MinuteDataDto } from '../../../models/models';
import { MinuteEnglish1Component } from './minute-english-1/minute-english-1.component';
import { MinuteNepali1Component } from './minute-nepali-1/minute-nepali-1.component';
import { MinuteDataService } from '../minute-data.service';

@Component({
  selector: 'app-minute-view',
  standalone: true,
  imports: [MinuteNepali1Component, MinuteEnglish1Component],
  templateUrl: './minute-view.component.html',
  styleUrl: './minute-view.component.scss'
})
export class MinuteViewComponent {
  minuteData = inject(MinuteDataService).getMinuteData();
}
