import { Component, effect, ElementRef, HostListener, output, viewChild } from '@angular/core';
import { SafeCloseDialogCustom } from '../../utils/safe-close-dialog-custom.directive';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss'
})
export class GlobalSearchComponent {
  dialogElementRef = viewChild<ElementRef<HTMLDialogElement>>('global_search_dialog');
  closeDialog = output();

  constructor() {
    effect(() => {
      this.dialogElementRef()!.nativeElement.showModal();
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydown(event: KeyboardEvent) {
    this.closeDialog.emit();
  }

  // Close when clicking outside the dialog content
  @HostListener('click', ['$event'])
  onDialogClick(event: MouseEvent) {
    const dlg = this.dialogElementRef()!.nativeElement;
    if (event.target === dlg && dlg.open) {
      this.closeDialog.emit();
    }
  }
}
