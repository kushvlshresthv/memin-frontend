import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommitteeCreationDto, MemberSearchResult} from '../../models/models';
import { MemberSelectionService } from './select-member-for-committee/select-member-for-committee.service';
import { HttpClient, } from '@angular/common/http';
import { BACKEND_URL } from '../../../global_constants';
import { Response } from '../../response/response';
import {  Router } from '@angular/router';
import { CommitteeFormComponent} from '../../forms/committee-form/committee-form.component';
import { LoadMemberService } from '../../load-member.service';

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
export class CreateCommitteeComponent implements OnInit{
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  //preparing data from CommitteeFormComponent
  hasDataLoaded = false; 
  committeeFormData: CommitteeFormData = {
    name: '',
    description: '',
    coordinator: {
      memberId: 0,
      firstName: '',
      lastName: '',
      post: '',
    },
    status: 'ACTIVE',
    maxNoOfMeetings: 0,
    minuteLanguage: null,
    selectedMembersWithRoles: [],
    unselectedMembers: [],
  };

  ngOnInit() {
    this.loadAllMembers();
  }


  loadMemberService = inject(LoadMemberService);

  loadAllMembers() {
    this.loadMemberService.loadAllMembers().subscribe({
      next: (loadedMembers) => {
	this.committeeFormData.unselectedMembers = loadedMembers;
	this.hasDataLoaded=true;
      },
      error: (response) => {
	console.log("TODO: handle error" + response);
      }
    });
  }

  //called when the create-committee.component's form is submitted
  onFormSave(committeeCreationDto: CommitteeCreationDto) {
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

export interface CommitteeFormData {
  name: string;
  description: string;
  coordinator: MemberSearchResult;
  status: 'ACTIVE' | 'INACTIVE';
  maxNoOfMeetings: number;
  minuteLanguage: 'NEPALI' | 'ENGLISH' | null;
  selectedMembersWithRoles:{
    member: MemberSearchResult;
    role: string;
  }[];
  unselectedMembers: MemberSearchResult[];
}
