import { Component } from '@angular/core';
import { PopupService } from './popup.service';
import { Popup } from '../models/models';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  displayPopup = false;
  popup!: Popup;
  constructor(private popupService: PopupService) {
    this.popupService.currentMessage$.subscribe({
      next: (value) => {
        if (value != null) {
          this.popup = value;
          this.displayPopup = true;
          setTimeout(() => (this.displayPopup = false), this.popup.displayTime);
        }
      },
    });
  }
}
