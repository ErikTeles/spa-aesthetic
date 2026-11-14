import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[appCelularMask]',
})
export class CelularMaskDirective {
  private readonly control = inject(NgControl, { self: true, optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    const formatted = digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/^\((\d{2})\) (\d{5})(\d)/, '($1) $2-$3');

    input.value = formatted;
    this.control?.control?.setValue(formatted, { emitEvent: false });
  }
}
