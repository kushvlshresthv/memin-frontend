import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateAndMeetingIdsDto } from '../../../models/models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  meetingDates: string[] = [];
  meetings = input.required<DateAndMeetingIdsDto[]>();

  currentYear = new Date().getFullYear();
  selectedYear = this.currentYear;
  months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  years: Set<number> = new Set();

  ngOnInit() {
    //if at least one meeting date is present
    if (
      this.meetings() != null &&
        this.meetings() != undefined &&
        this.meetings().length > 0
    ) {
      console.log(this.meetings());

        this.meetingDates = this.meetings().map((dateAndMeetingIds) => dateAndMeetingIds.meetingDate);

      console.log(this.meetingDates);
      this.years = new Set(
        this.meetingDates.map((date) => new Date(date).getFullYear()),
      );

      this.years.add(this.currentYear);
    } else {
      this.years.add(this.currentYear);
    }
  }

  getMonthName(month: number): string {
    return new Date(this.selectedYear, month).toLocaleString('default', {
      month: 'long',
    });
  }

  getDaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  isMeeting(date: Date): boolean {
    if(this.meetingDates == null || this.meetingDates == undefined || this.meetingDates.length <= 0){
      return false;
    }
    return this.meetingDates.some(
      (d) => new Date(d).toDateString() === date.toDateString(),
    );
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }
}
