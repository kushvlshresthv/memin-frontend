import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener,  input,  Input,  OnDestroy,  OnInit,  ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Directive({
  selector: '[appSafeCloseDialogCustom]',
  standalone: true,
})
export class SafeCloseDialogCustom implements OnInit, OnDestroy {
  customSaveForm = input.required<()=> void>();
  customRestoreForm = input.required<()=> void>();

  constructor(private dialogElementRef: ElementRef<HTMLDialogElement>, private router: Router) {}



  @HostListener('document:keydown.escape', ['$event'])
  onKeydown(event: KeyboardEvent) {
      this.closeDialog();
  }

  // Close when clicking outside the dialog content
  @HostListener('click', ['$event'])
  onDialogClick(event: MouseEvent) {
    console.log("checking, standby");
    const dlg = this.dialogElementRef.nativeElement;
    if (event.target === dlg && dlg.open) {
        this.closeDialog();
    }
  }

  closeDialog() {
    const dialog = this.dialogElementRef?.nativeElement;
    this.customSaveForm()();
    dialog.close();
    this.router.navigate(['./home/my-committees']);
  }

  ngOnInit(): void {
    this.customRestoreForm()();
  }

  ngOnDestroy() {
    console.log("DEBUG:  safe-close-dialog-custom destroyed");
  }
}
