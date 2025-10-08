import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { committeeDetailsGuard, isAuthenticated } from './app.guards';
import { CommitteeSummariesComponent } from './home/committee-summaries/committee-summaries.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CreateCommitteeComponent } from './home/create-committee/create-committee.component';
import { CreateMemberComponent } from './home/create-member/create-member.component';
import { CommitteeOverviewComponent } from './committee-details/committee-overview/committee-overview.component';
import { CommitteeDetailsComponent } from './committee-details/committee-details.component';
import { MeetingSummariesComponent } from './committee-details/committee-overview/meeting-summaries/meeting-summaries.component';

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
        path: '**',
        component: ErrorComponent,
      },
    ],
  },


  {
    path: 'committee-details',
    component: CommitteeDetailsComponent,
    canMatch: [isAuthenticated],
    canActivate: [committeeDetailsGuard],
    children: [
      {
        path: 'committee-overview',
        component: CommitteeOverviewComponent,
      },

      {
        path: 'view-minutes',
        component: MeetingSummariesComponent,
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
