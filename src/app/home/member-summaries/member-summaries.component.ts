import { Component, OnInit } from '@angular/core';
import { MemberSearchResult } from '../../models/models';
import { Response } from '../../response/response'
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../global_constants';
import { MemberSummaryComponent } from './member-summary/member-summary.component';

@Component({
  selector: 'app-member-summaries',
  standalone: true,
  imports: [MemberSummaryComponent],
  templateUrl: './member-summaries.component.html',
  styleUrl: './member-summaries.component.scss'
})
export class MemberSummariesComponent implements OnInit {
  memberSummaries!: MemberSearchResult[];
  memberSummariesLoaded = false;

  constructor(private httpClient: HttpClient){}

  ngOnInit() {
    this.httpClient.get<Response<MemberSearchResult[]>>(BACKEND_URL+"/api/getAllMembers", {withCredentials: true}).subscribe({
      next: (response) => {
	this.memberSummaries = response.mainBody;
	this.memberSummariesLoaded = true;
	console.log("data has been loaded: member summaries");
	console.log(this.memberSummaries);
      },
      error: (error) => {
	console.log("TODO: show response properly", error);
      }
    });
  }
}
