import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appRecognizeNepaliText]',
  standalone: true,
})
export class RecognizeNepaliTextDirective {
  @Input('appNepaliFont') text: string | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.applyFont();
    }
  }

  private applyFont(): void {
    if (this.text && this.isNepali(this.text)) {
      this.renderer.addClass(this.el.nativeElement, 'nepali-font');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'nepali-font');
    }
  }

  private isNepali(value: string): boolean {
    const firstChar = value.charCodeAt(0);
    return firstChar >= 2304 && firstChar <= 2431;
  }
}
