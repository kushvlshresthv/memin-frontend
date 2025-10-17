import { Component, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { MinuteDataDto } from '../../../../../models/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-minute-view',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './minute-view.component.html',
  styleUrl: './minute-view.component.scss'
})
export class MinuteViewComponent {
  minuteData = input.required<MinuteDataDto>();
}
