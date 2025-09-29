import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener,  Input,  OnInit,  ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Directive({
  selector: '[appSafeCloseDialog]',
  standalone: true,
})
export class SafeCloseDialogDirective implements AfterViewInit {
  @Input({required:true}) formGroup!: FormGroup;
  constructor(private dialogElementRef: ElementRef<HTMLDialogElement>, private router: Router) {}

  @HostListener('document:keydown.escape', ['$event'])
  onKeydown(event: KeyboardEvent) {
      this.closeDialog();
  }

  // Close when clicking outside the dialog content
  @HostListener('click', ['$event'])
  onDialogClick(event: MouseEvent) {
    const dlg = this.dialogElementRef.nativeElement;
    if (event.target === dlg && dlg.open) {
        this.closeDialog();
    }
  }

  closeDialog() {
    const dialog = this.dialogElementRef?.nativeElement;
    this.saveFormData();
    dialog.close();
    this.router.navigate(['./home/my-committees']);
  }

  ngAfterViewInit(): void {
    // Load saved form data from localStorage
    const savedData = localStorage.getItem('createMemberForm');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        this.formGroup.patchValue(parsedData); // prefill the form
      } catch (err) {
        console.error('Failed to parse saved form data', err);
      }
    }
  }


  saveFormData() {
    console.log(this.formGroup);
    if (!this.formGroup) return;

    const formValue = this.formGroup.getRawValue();

    // Check if at least one field has some value
    const hasData = Object.values(formValue).some(
      (value) => value !== null && value !== undefined && value !== '',
    );

    if (!hasData) {
      console.log('Form is empty. Not saving.');
      return;
    }

    // Save whatever data is entered, even if form is invalid
    localStorage.setItem('createMemberForm', JSON.stringify(formValue));
  };
}
