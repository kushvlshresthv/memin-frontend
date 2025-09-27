import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberSearchResult } from '../models/models';
import { BACKEND_URL } from '../../global_constants';
import { Response } from '../response/response';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormControlName } from '@angular/forms';
import Fuse from 'fuse.js';
import { query } from '@angular/animations';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  allMembers!: MemberSearchResult[];
  searchResults!: MemberSearchResult[];
  httpClient = inject(HttpClient);
  router = inject(Router);
  formData = new FormGroup({
    searchInput: new FormControl(''),
  });

  ngOnInit(): void {
    this.httpClient
      .get<Response<MemberSearchResult[]>>(BACKEND_URL + '/api/getAllMembers', {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          this.allMembers = response.mainBody;
          this.searchResults = response.mainBody;
          console.log(this.allMembers);
        },
        error: (error) => {
          //TODO: show the error in the pop up
          console.log(error);
        },
      });

    this.formData.controls.searchInput.valueChanges
      .pipe(debounceTime(500)) // wait 0.5 seconds after user stops typing
      .subscribe((value) => {
        if (value === '') {
          this.searchResults = this.allMembers;
        } else {
          this.searchResults = this.fuzzySearch(
            this.allMembers,
            value as string,
          );
        }
      });
  }

  fuzzySearch(
    users: MemberSearchResult[],
    query: string,
  ): MemberSearchResult[] {
    const fuse = new Fuse(users, {
      keys: ['firstName', 'lastName'],
      threshold: 0.3, // lower = stricter match
    });
    return fuse.search(query).map((result) => result.item);
  }
}
