import {
  Component,
} from '@angular/core';
import { CommitteeCreationDto} from '../../models/models';
import { MemberSelectionService } from './select-member-for-committee/select-member-for-committee.service';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../global_constants';
import { Response } from '../../response/response';
import { Router } from '@angular/router';
import { CommitteeFormComponent } from '../../forms/committee-form/committee-form.component';

@Component({
  selector: 'app-create-committee',
  standalone: true,
  imports: [
    CommitteeFormComponent
  ],
  templateUrl: './create-committee.component.html',
  styleUrl: './create-committee.component.scss',
  providers: [MemberSelectionService],
})
export class CreateCommitteeComponent {

  constructor(private httpClient: HttpClient, private router: Router){}

  createCommittee(committeeCreationDto: CommitteeCreationDto) {
    console.log(committeeCreationDto);
    this.httpClient.post<Response<string[]>>(BACKEND_URL + '/api/createCommittee', committeeCreationDto, {
      withCredentials: true,
    }).subscribe({
      next: (response) => {
        console.log(response.message);
        localStorage.removeItem('createCommitteeForm');
        localStorage.removeItem('selectedMembersWithRole');
        this.router.navigate(['/home/my-committees']);
        console.log("TODO: show in popup" + response.message);
      },
      error: (error) => {
        console.log('TODO: show in popup' + error.error.message);
        //TODO: show popup and redirect to my-committees
      }
    });
  }
}
