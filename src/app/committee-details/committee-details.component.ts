import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BACKEND_URL } from '../../global_constants';
import { CommitteeDetailsDto, MemberSummaryDto } from '../models/models';
import { Response } from '../response/response';
import { MemberSummariesComponent } from './committee-overview/member-summaries/member-summaries.component';

@Component({
  selector: 'app-committee-details',
  standalone: true,
  imports: [RouterOutlet, MemberSummariesComponent],
  templateUrl: './committee-details.component.html',
  styleUrl: './committee-details.component.scss',
})
export class CommitteeDetailsComponent{
  committeeMembers: MemberSummaryDto[] = [];
  ngOnInit(): void {
    //TODO: fetch committee members from backend

    this.committeeMembers.push({
      memberId: 1,
      firstName: "Ram Bahadur Shrestha",
      lastName: "Sharma",
      institution: "Kathmandu University",
      post: "President",
      role: "Admin"
      })

    this.committeeMembers.push({
        memberId: 2,
        firstName: "Shyam",
        lastName: "Thapa",
        institution: "Tribhuvan University",
        post: "Member",
        role: "User"
        })

    this.committeeMembers.push({
      memberId: 3,
      firstName: "Hari",
      lastName: "Gurung",
      institution: "Pokhara University",
      post: "Secretary",
      role: "User"
      })

    this.committeeMembers.push({
      memberId: 4,
      firstName: "Sita",
      lastName: "Kumari",
      institution: "Patan Academy of Health Sciences",
      post: "Member",
      role: "User"
      })

    this.committeeMembers.push({
      memberId: 5,
      firstName: "Gita",
      lastName: "Rai",
      institution: "B.P. Koirala Institute of Health Sciences",
      post: "Member",
      role: "User"
      })


    this.committeeMembers.push({
      memberId: 1,
      firstName: "Ram Bahadur Shrestha",
      lastName: "Sharma",
      institution: "Kathmandu University",
      post: "President",
      role: "Admin"
      })

    this.committeeMembers.push({
        memberId: 2,
        firstName: "Shyam",
        lastName: "Thapa",
        institution: "Tribhuvan University",
        post: "Member",
        role: "User"
        })

    this.committeeMembers.push({
      memberId: 3,
      firstName: "Hari",
      lastName: "Gurung",
      institution: "Pokhara University",
      post: "Secretary",
      role: "User"
      })

    this.committeeMembers.push({
      memberId: 4,
      firstName: "Sita",
      lastName: "Kumari",
      institution: "Patan Academy of Health Sciences",
      post: "Member",
      role: "User"
      })

    this.committeeMembers.push({
      memberId: 5,
      firstName: "Gita",
      lastName: "Rai",
      institution: "B.P. Koirala Institute of Health Sciences",
      post: "Member",
      role: "User"

      })


    this.committeeMembers.push({
      memberId: 1,
      firstName: "Ram Bahadur Shrestha",
      lastName: "Sharma",
      institution: "Kathmandu University",
      post: "President",
      role: "Admin"
      })

    this.committeeMembers.push({
        memberId: 2,
        firstName: "Shyam",
        lastName: "Thapa",
        institution: "Tribhuvan University",
        post: "Member",
        role: "User"
        })

    this.committeeMembers.push({
      memberId: 3,
      firstName: "Hari",
      lastName: "Gurung",
      institution: "Pokhara University",
      post: "Secretary",
      role: "User"
      })

    this.committeeMembers.push({
      memberId: 4,
      firstName: "Sita",
      lastName: "Kumari",
      institution: "Patan Academy of Health Sciences",
      post: "Member",
      role: "User"
      })

    this.committeeMembers.push({
      memberId: 5,
      firstName: "Gita",
      lastName: "Rai",
      institution: "B.P. Koirala Institute of Health Sciences",
      post: "Member",
      role: "User"
      })
  }
}
