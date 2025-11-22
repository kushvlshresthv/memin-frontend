import { Component, inject, input, OnInit } from '@angular/core';
import { MinuteDataService } from '../minute-data.service';
import { FormsModule } from '@angular/forms';
import {
  AgendaDto,
  DecisionDto,
  MinuteUpdateDto,
} from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Response } from '../../../response/response';
import { BACKEND_URL } from '../../../../global_constants';

@Component({
  selector: 'app-minute-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './minute-edit.component.html',
  styleUrl: './minute-edit.component.scss',
})
export class MinuteEditComponent implements OnInit {
  minuteDataService = inject(MinuteDataService);
  minuteData = this.minuteDataService.getMinuteData();
  count = -1; //unique negative number which is assigned as the decision or agenda id which is used for deletion
  httpParams = new HttpParams();

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log('setting params');
      this.httpParams = this.httpParams.set(
        'committeeId',
        params['committeeId'],
      );
      this.httpParams = this.httpParams.set('meetingId', params['meetingId']);
      console.log(params['committeeId']);
    });
  }

  createEmptyAgenda() {
    const newAgenda = new AgendaDto();
    newAgenda.agendaId = this.count;
    this.count--;
    this.minuteData().agendas.push(newAgenda);
  }

  createEmptyDecision() {
    const newDecision = new DecisionDto();
    newDecision.decisionId = this.count;
    this.count--;
    this.minuteData().decisions.push(newDecision);
  }

  deleteAgenda(agendaId: number) {
    this.minuteData().agendas = this.minuteData().agendas.filter(
      (agenda) => agenda.agendaId !== agendaId,
    );
  }

  deleteDecision(decisionId: number) {
    this.minuteData().decisions = this.minuteData().decisions.filter(
      (decision) => decision.decisionId !== decisionId,
    );
  }
  onSubmit() {
    const minuteUpdateDto = new MinuteUpdateDto();
    minuteUpdateDto.committeeName = this.minuteData().committeeName;
    minuteUpdateDto.committeeDescription =
      this.minuteData().committeeDescription;
    minuteUpdateDto.meetingHeldDate = this.minuteData().meetingHeldDate;
    minuteUpdateDto.meetingHeldTime = this.minuteData().meetingHeldTime;
    minuteUpdateDto.meetingHeldPlace = this.minuteData().meetingHeldPlace;
    minuteUpdateDto.decisions = this.minuteData().decisions;
    minuteUpdateDto.agendas = this.minuteData().agendas;

    this.httpClient
      .post<
        Response<Object>
      >(BACKEND_URL + '/api/updateMinute', minuteUpdateDto, { withCredentials: true, params: this.httpParams })
      .subscribe({
        next: (response) => {
          console.log('TODO: handle this properly' + response.message);
          this.router.navigate(['./committee-details/overview'], {
            queryParamsHandling: 'preserve',
          });
        },

        error: (error) => {
          console.log('TODO: handle this properly');
        },
      });

    console.log(minuteUpdateDto);
    console.log(this.httpParams);

    //when form is submitted, first remove the empty decision and agenda, as server won't accept those(probably, check later);

    //no include all decisions and agendas, server will not save the empty ones, remove the deleted ones, and add new ones

    //the submit to the backend
  }
}
