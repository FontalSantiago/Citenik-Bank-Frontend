import { Directive, ElementRef, HostListener } from '@angular/core';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsAr, 'es-Ar');
@Directive({
  selector: 'input[separator]',
})
export class SeparatorDirective {
  constructor(private _inputEl: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (this._inputEl.nativeElement.value === '-') return;
    let commasRemoved = this._inputEl.nativeElement.value.replace(/\./g, '');
    let toInt: number;
    let toLocale: string;
    if (commasRemoved.length > 1 && commasRemoved.split(',').length > 1) {
      let decimal = isNaN(parseInt(commasRemoved.split(',')[1]))
        ? ''
        : parseInt(commasRemoved.split(',')[1]);
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('es-Ar') + ',' + decimal;
    } else {
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('es-Ar');
    }
    if (toLocale === 'NaN') {
      this._inputEl.nativeElement.value = '';
    } else {
      this._inputEl.nativeElement.value = toLocale;
    }
  }
}