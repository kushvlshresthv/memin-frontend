import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BACKEND_URL } from '../../global_constants';
import { CommitteeDetailsDto } from '../models/models';
import { Response } from '../response/response';

@Component({
  selector: 'app-committee-details',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './committee-details.component.html',
  styleUrl: './committee-details.component.scss',
})
export class CommitteeDetailsComponent{
}
