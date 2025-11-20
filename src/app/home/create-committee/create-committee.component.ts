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
import { CommitteeFormComponent, CommitteeFromComponentFormGroup } from '../../forms/committee-form/committee-form.component';
import { FormControl, Validators, FormGroup } from '@angular/forms';
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

  name = new FormControl();
  description = new FormControl();
  defaultOptionForCoordinator: MemberSearchResult = {
    memberId: 0,
    firstName: '',
    lastName: '',
    post: '',
  };
  coordinator = new FormControl<MemberSearchResult>(
    this.defaultOptionForCoordinator,
    {
      nonNullable: true,
    },
  );
  status = new FormControl<'ACTIVE' | 'INACTIVE'>('ACTIVE', {
    nonNullable: true,
    validators: [Validators.required],
  });
  maxNoOfMeetings = new FormControl();
  minuteLanguage = new FormControl<'NEPALI' | 'ENGLISH' | null>(null);
  formData = new FormGroup<CommitteeFromComponentFormGroup>({
    name: this.name,
    description: this.description,
    coordinator: this.coordinator,
    status: this.status,
    maxNoOfMeetings: this.maxNoOfMeetings,
    minuteLanguage: this.minuteLanguage,
  });

  ngOnInit() {
    this.loadAllMembers();
  }

  //preparing data for SelectMemberForCommtteeComponent
  //basically loads all the members, creates a FormControl(to store Role) for each members and initialize the FormControl with 'Add'

  //this function also initializes the MemberSelectionService

  loadMemberService = inject(LoadMemberService);
  memberSelectionService = inject(MemberSelectionService);
  memberAndRoleFormControlMap = new Map<number, FormControl<string>>();

  loadAllMembers() {
    this.loadMemberService.loadAllMembers().subscribe({
      next: (loadedMembers) => {
	this.memberSelectionService.setUnselected(loadedMembers);
	this.memberSelectionService.setDisplayed(loadedMembers);
	console.log("unselected members");
	console.log(this.memberSelectionService.unselected());
	loadedMembers.forEach((member)=> {
	  this.memberAndRoleFormControlMap.set(
	    member.memberId,
	    new FormControl('Add', {nonNullable:true})
	  );
	});

      },
      error: (response) => {
	console.log("TODO: handle error" + response);
      }
    });
  }




  //called when the create-committee.component's form is submitted
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



