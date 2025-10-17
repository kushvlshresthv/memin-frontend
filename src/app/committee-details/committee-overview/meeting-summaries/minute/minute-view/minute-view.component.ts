import { Component, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { MinuteDataDto } from '../../../../../models/models';

@Component({
  selector: 'app-minute-view',
  standalone: true,
  imports: [],
  templateUrl: './minute-view.component.html',
  styleUrl: './minute-view.component.scss'
})
export class MinuteViewComponent {
  minuteData = input.required<MinuteDataDto>();
}
