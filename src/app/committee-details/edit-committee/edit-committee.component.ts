import { Component } from '@angular/core';
import { CommitteeFormComponent } from '../../forms/committee-form/committee-form.component';
import { MemberSelectionService } from '../../home/create-committee/select-member-for-committee/select-member-for-committee.service';

@Component({
  selector: 'app-edit-committee',
  standalone: true,
  imports: [CommitteeFormComponent],
  templateUrl: './edit-committee.component.html',
  styleUrl: './edit-committee.component.scss',
  providers: [MemberSelectionService],
})
export class EditCommitteeComponent {
  onFormSave() {
    console.log("saving form");
  }
}

