import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener,  input,  Input,  OnDestroy,  OnInit,  ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Directive({
  selector: '[appSafeCloseNewDialog]',
  standalone: true,
})
export class SafeCloseDialogNewDirective implements OnDestroy {
  formName = input.required<string>({alias: 'appSafeCloseNewDialog'});
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

  ngOnInit(): void {
    //restore form normally ie restores the FormGroup
    const savedData = localStorage.getItem(this.formName());
    if (savedData) {
      console.log("Found the saved Data");
      console.log(savedData);
      try {
        const parsedData = JSON.parse(savedData);
        this.formGroup.patchValue(parsedData); // prefill the form
      } catch (err) {
        console.error('Failed to parse saved form data', err);
      }
    }
  }

  //saves the provided FormGroup
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
    console.log("Saving");
    console.log(formValue);

    // Save whatever data is entered, even if form is invalid
    localStorage.setItem(this.formName(), JSON.stringify(formValue));
  };

  ngOnDestroy() {
    console.log("DEBUG:  safe-close-dialog destroyed");
  }
}
