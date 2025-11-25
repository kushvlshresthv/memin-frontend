import { Component, Input } from '@angular/core';
import { CommitteeSummary } from './committee-summary.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-committee-summary',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './committee-summary.component.html',
  styleUrl: './committee-summary.component.scss',
})
export class CommitteeSummaryComponent {
  @Input({ required: true }) committeeSummary!: CommitteeSummary;

  showMenuOptions = false;

  constructor(private router: Router) {
    
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenuOptions = !this.showMenuOptions;
  }

  onEditOptionClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['./committee-details/edit'], {
      queryParams: {
	committeeId: this.committeeSummary.id
      }
    })
  }


  onOverviewOptionClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['./committee-details/overview'], {
      queryParams: {
	committeeId: this.committeeSummary.id
      }
    })
  }

  onSummaryOptionClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['./committee-details/summary'], {
      queryParams: {
	committeeId: this.committeeSummary.id
      }
    })
  }


  onArchiveOptionClick(event: Event) {
    event.stopPropagation();

  }
    

  
}
