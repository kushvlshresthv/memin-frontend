import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { committeeRouteGuard, isAuthenticated, memberRouteGuard } from './app.guards';
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
import { ViewArchivesComponent } from './home/view-archives/view-archives.component';
import { CommitteeSummaryComponent } from './home/committee-summaries/committee-summary/committee-summary.component';
import { CommitteeExtendedSummaryComponent } from './committee-details/committee-extended-summary/committee-extended-summary.component';
import { EditMemberComponent } from './home/member-summaries/edit-member/edit-member.component';

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
	// it is not a children to members-list because children's require <router-outlet> and it is an independent page to members list 
	canActivate: [memberRouteGuard],
	path: 'members-list/edit',
	component: EditMemberComponent
      },
      {
        path: 'members-list',
        component: MemberSummariesComponent,
      },
      {
        path: 'archives',
        component: ViewArchivesComponent,
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
    children: [
      {
        //TODO: only open this when there is a meetingId
        path: 'overview/minute',
        component: MinuteComponent,
      },
      {
        canActivate: [committeeRouteGuard],
        path: 'overview',
        component: CommitteeOverviewComponent,
      },
      {
        canActivate: [committeeRouteGuard],
        path: 'edit',
        component: EditCommitteeComponent,
      },
      {
        canActivate: [committeeRouteGuard],
        path: 'summary',
        component: CommitteeExtendedSummaryComponent,
      },
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
