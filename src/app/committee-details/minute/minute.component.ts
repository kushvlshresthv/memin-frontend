import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MinuteViewComponent } from './minute-view/minute-view.component';
import { MinuteEditComponent } from './minute-edit/minute-edit.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BACKEND_URL } from '../../../global_constants';
import { MinuteDataDto } from '../../models/models';
import { Response } from '../../response/response';
import { MinuteDataService } from './minute-data.service';

@Component({
  selector: 'app-minute',
  standalone: true,
  imports: [MinuteViewComponent, MinuteEditComponent],
  templateUrl: './minute.component.html',
  styleUrl: './minute.component.scss',
  providers: [MinuteDataService, MinuteViewComponent],
})
export class MinuteComponent {
}

