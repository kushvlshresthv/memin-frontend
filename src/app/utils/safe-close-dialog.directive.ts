import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener,  Input,  OnDestroy,  OnInit,  ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Directive({
  selector: '[appSafeCloseDialog]',
  standalone: true,
})
export class SafeCloseDialogDirective implements OnInit, OnDestroy {
  @Input(/*{required:true}*/) formGroup!: FormGroup;
  constructor(private dialogElementRef: ElementRef<HTMLDialogElement>, private router: Router) {}

  @Input() customSaveForm!:()=> void;
  @Input() customRestoreForm!: ()=> void;


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
    if(this.customSaveForm) {
      this.customSaveForm();
    } else {
      this.saveFormData();
    }
    dialog.close();
    this.router.navigate(['./home/my-committees']);
  }

  ngOnInit(): void {
    // if a custom restore form method is available use that
    if(this.customRestoreForm) {
      this.customRestoreForm();
      return;
    }

    //restore form normally
    const savedData = localStorage.getItem('savedForm');
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
    localStorage.setItem('savedForm', JSON.stringify(formValue));
  };

  ngOnDestroy() {
    console.log("DEBUG:  safe-close-dialog destroyed");
  }
}
