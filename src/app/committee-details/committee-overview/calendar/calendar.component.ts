import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  meetingDates = input.required<string[]>();

  currentYear = new Date().getFullYear();
  selectedYear = this.currentYear;
  months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  years: number[] = [];

  ngOnInit() {
    this.years = this.meetingDates().map((date) => new Date(date).getFullYear());
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
    return this.meetingDates().some(
      (d) => new Date(d).toDateString() === date.toDateString(),
    );
  }

  isToday(date: Date) : boolean {
    return date.toDateString() === new Date().toDateString();
  }
}
