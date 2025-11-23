import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { committeeRouteGuard, isAuthenticated } from './app.guards';
import { CommitteeSummariesComponent } from './home/committee-summaries/committee-summaries.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CreateCommitteeComponent } from './home/create-committee/create-committee.component';
import { CreateMemberComponent } from './home/create-member/create-member.component';
import { CommitteeOverviewComponent } from './committee-details/committee-overview/committee-overview.component';
import { CommitteeDetailsComponent } from './committee-details/committee-details.component';
import { MinuteComponent } from './committee-details/minute/minute.component';
import { CreateMeetingComponent } from './home/create-meeting/create-meeting.component';
import { EditCommitteeComponent } from './committee-details/edit-committee/edit-committee.component';
import { MemberSummariesComponent } from './home/member-summaries/member-summaries.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/my-committees',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  

  {
    path: 'home',
    component: HomeComponent,
    canMatch: [isAuthenticated],
    children: [
      {
        path: 'my-committees',
        component: CommitteeSummariesComponent,
      },
      {
        path: 'create-committee',
        component: CreateCommitteeComponent,
      },
      {
        path: 'create-member',
        component: CreateMemberComponent,
      },
      {
        path: 'create-meeting',
        component: CreateMeetingComponent,
      },
      {
	path: 'members-list',
	component: MemberSummariesComponent,
      },
      {
        path: '**',
        component: ErrorComponent,
      },
    ],
  },


  {
    path: 'committee-details',
    component: CommitteeDetailsComponent,
    canMatch: [isAuthenticated],
    canActivate: [committeeRouteGuard],
    children: [
      {
        path: 'overview/minute',
        component: MinuteComponent,
      },
      {
        path: 'overview',
        component: CommitteeOverviewComponent,
      },
      {
	path: 'edit',
	component: EditCommitteeComponent,
      },
      // {
      //   //this is above meetings so that meetings/minute is rendered directly in the /committee-details instead of inside the /meetings
      //   path: 'meetings/minute',
      //   component: MinuteComponent,
      // },
      //
      //
      // {
      //   path: 'meetings',
      //   component: MeetingSummariesComponent,
      // },

      {
        path: '**',
        component: ErrorComponent,
      },
    ],
  },

  {
    path: 'search',
    component: SearchBarComponent,
  },

  {
    path: '**',
    component: ErrorComponent,
  },
];
