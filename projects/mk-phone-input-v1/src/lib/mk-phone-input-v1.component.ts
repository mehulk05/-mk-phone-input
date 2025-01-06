import {
  Component,
  OnInit,
  AfterViewInit,
  DoCheck,
  OnDestroy,
  Input,
  Host,
  ViewChild,
  Optional,
  Self,
  ElementRef,
  HostBinding,
  forwardRef,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ValidationErrors,
  FormGroupDirective,
  NgForm,
  ControlContainer,
  NgControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';

import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import countries, { Country, Countries } from 'world-countries';
import {
  PhoneNumber,
  PhoneNumberUtil,
  PhoneNumberFormat,
  PhoneNumberType,
  AsYouTypeFormatter,
} from 'google-libphonenumber';

class PhoneNumberErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const formHasPhoneNumberError = form?.getError('format');
    const formHasCountryError = form?.getError('country');
    const isSubmitted = form && form.submitted;

    return !!(control && (control.invalid || formHasPhoneNumberError || formHasCountryError) && (control.touched || isSubmitted));
  }
}

@Component({
  selector: 'lib-mk-phone-input-v1',
  standalone: false,
  
  templateUrl: './mk-phone-input-v1.component.html',
  styleUrl: './mk-phone-input-v1.component.css',
  // providers: [
  //   { provide: MatFormFieldControl, useExisting: MkPhoneInputV1Component },
  // ],
})




export class MkPhoneInputV1Component implements OnInit,
AfterViewInit,
DoCheck,
OnDestroy,
MatFormFieldControl<string>,
ControlValueAccessor {

/**
 * MatFormFieldControl properties
 */

static nextId = 0;

stateChanges = new Subject<void>();
id = `ngx-mat-tel-input-${MkPhoneInputV1Component.nextId++}`;
placeholder: string = '';
focused = false;
errorState = false;
controlType = 'ngx-mat-tel-input';
// autofilled?: boolean;

@HostBinding('attr.aria-describedby') describedBy = '';

get value(): string {
  return this.formGroup.get('outputPhoneNumber')?.value || '';
}

set value(value: string) {
  this.formGroup.get('phoneNumber')?.setValue(value);
}

get empty(): boolean {
  return !this.formGroup.get('phoneNumber')?.value;
}

get shouldLabelFloat(): boolean {
  // If we are showing the country picker (i.e. this.countries.length > 1), always float
  if (this.countries.length > 1) {
    return true;
  }
  return this.focused || !this.empty;
}

get required(): boolean {
  return this.elementRef.nativeElement.hasAttribute('required');
}

get disabled(): boolean {
  return !!(this.formGroup.get('phoneNumber')?.disabled || this.formGroup.get('country')?.disabled);
}

/**
 * ControlValueAccessor properties
 */

onTouched: (() => void) | undefined;

/**
 * MkPhoneInputV1Component properties and methods
 */

@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

@Input() defaultCountry: any;
@Input() countryWhitelist: string[];
@Input() countryBlacklist: string[];
@Input() format: PhoneNumberFormat = PhoneNumberFormat.E164;

countries: Countries = countries;
filteredCountries: Observable<Countries>;

formGroup = new FormGroup({
  countryFilter: new FormControl({ value: '', disabled: false }),
  country: new FormControl({ value: '', disabled: false }),
  phoneNumber: new FormControl({ value: '', disabled: false }),
  outputPhoneNumber: new FormControl(''),
}, [this.phoneNumberValidator.bind(this)]);

phoneNumberErrorStateMatcher = new PhoneNumberErrorStateMatcher();

private isTouched = false;

private subscription: Subscription = new Subscription();

get country(): FormControl {
  return this.formGroup.get('country') as FormControl;
}

private static getExampleNumber(country: Country): string {
  const phoneNumberUtil = PhoneNumberUtil.getInstance();
  const exampleNumber = phoneNumberUtil.getExampleNumberForType(country.cca2, PhoneNumberType.MOBILE);
  const exampleNumberString = phoneNumberUtil.format(exampleNumber, PhoneNumberFormat.NATIONAL);
  return `eg. ${exampleNumberString}`;
}

private static includes(a: string, b: string): boolean {
  // This function tells you whether "b" is a substring of "a". We remove diacritics (i.e. accent marks) and lowercase
  // both arguments before performing a comparison.
  a = a.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  b = b.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return a.toLowerCase().includes(b.toLowerCase());
}

constructor(private controlContainer: ControlContainer,
  @Host() private parentFormGroupDirective: FormGroupDirective,
  private focusMonitor: FocusMonitor,
  private elementRef: ElementRef<HTMLElement>,
  @Optional() @Self() public ngControl: NgControl) {

  // Monitor our component's root DOM element for focus state changes
  this.subscription.add(
    focusMonitor.monitor(elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    })
  );

  // Replace the provider from above with this.
  if (this.ngControl != null) {
    // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
    this.ngControl.valueAccessor = this;
  }

}

onSelectionChange(selection: Country): void {
  this.placeholder = MkPhoneInputV1Component.getExampleNumber(selection);
  // this.formGroup.get('phoneNumber')?.updateValueAndValidity();

  // Attempt to format the user's input
  this.formatUserInput();
}

onKeyDown(event: any): void {
  // Restrict the user's input
  const validKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '(', ')', '-', ' ',
    'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
  ];

  if (validKeys.includes(event.key)) {
    return;
  }
  if (event.ctrlKey && (event.key === 'x' || event.key === 'c' || event.key === 'v' || event.key === 'a')) {
    return;
  }

  event.preventDefault();
}

onKeyUp(event: any): void {
  // Format the user's input, but only if the caret is at the end
  if (event.target.selectionStart === this.formGroup.get('phoneNumber')?.value.length) {
    this.formatUserInput();
  }
}

onClick(event: any): void {
  // Format the user's input, but only if the caret is at the end
  if (event.target.selectionStart === this.formGroup.get('phoneNumber')?.value.length) {
    this.formatUserInput();
  }
}

onPaste(event: ClipboardEvent) {
  // Remove invalid characters from pasted data. We only allow digits 0-9 and +.
  const data = event.clipboardData.getData('text');
  this.formGroup.get('phoneNumber')?.setValue(
    data.replace(/[^0-9+]/g, '')
  );

  event.preventDefault();
}

onBlur(event: any): void {
  if (!this.isTouched) {
    this.isTouched = true;
    this.onTouched();
  }

  // Format the user's input only if the caret is **not** at the end.
  // If the caret is at the end of the input, that means the user's input has already been formatted.
  if (event.target.selectionStart !== this.formGroup.get('phoneNumber')?.value?.length) {
    this.formatUserInput();
  }
}

private phoneNumberValidator(control: any): ValidationErrors | null {
  const inputCountry: Country = control.get('country').value;
  const inputPhoneNumber: string = control.get('phoneNumber').value;

  control.get('outputPhoneNumber').setValue(inputPhoneNumber, { onlySelf: true });

  if (inputPhoneNumber === '') {
    return null;
  }

  try {
    // Attempt to parse the phone number using libphonenumber
    const phoneNumberUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();
    const phoneNumber: PhoneNumber = phoneNumberUtil.parse(inputPhoneNumber, inputCountry.cca2);
    const regionCode: string = phoneNumberUtil.getRegionCodeForNumber(phoneNumber);

    // Update the country picker to match region code of phone number
    let isCountryInWhitelist = true;
    if (regionCode && regionCode !== inputCountry.cca2) {
      const country = this.countries.find((el: Country): boolean => el.cca2 === regionCode);
      if (country) {
        control.get('country').setValue(country, { onlySelf: true });
      } else {
        isCountryInWhitelist = false;
      }
    }

    //  If the phone number is valid, format it and return it to the user
    const isValidNumber = phoneNumberUtil.isValidNumber(phoneNumber);
    if (isValidNumber) {
      const formattedPhoneNumber: string = phoneNumberUtil.format(phoneNumber, this.format);
      control.get('outputPhoneNumber').setValue(formattedPhoneNumber, { onlySelf: true });
    }

    // If the phone number is not valid, signal a format error
    if (!isValidNumber) {
      return { format: true };
    }

    // If the phone number's country is not in the country whitelist, signal a country error
    if (!isCountryInWhitelist) {
      return { country: true };
    }

    return null;

  } catch (e: any) {

    if (e instanceof Error && (
      e.message !== 'The string supplied is too long to be a phone number' &&
      e.message !== 'The string supplied did not seem to be a phone number' &&
      e.message !== 'The string supplied is too short to be a phone number' &&
      e.message !== 'Invalid country calling code' &&
      e.message !== 'Phone number too short after IDD')) {
      // unexpected error
      console.error(e.toString());
    }

    // NumberParseException exception was thrown, signal a format error
    return { format: true };

  }

  // unreachable

}

private filter(q: string): Countries {
  return this.countries.filter((country: Country): boolean => {
    return (
      MkPhoneInputV1Component.includes(country.name.common, q) ||
      MkPhoneInputV1Component.includes(country.name.official, q)
    );
  });
}

private formatUserInput(): void {
  // Only call this method if (A) the caret is at the end of the input, or (B) if the input is not in focus!

  const country = this.formGroup.get('country')?.value as unknown as Country | null;
  console.log('country', country);
  let formattedPhoneNumber = ''
  if (country?.cca2) {
    const formatter = new AsYouTypeFormatter(country.cca2);
    for (const d of this.formGroup.get('phoneNumber')?.value || '') {
      if ((d >= '0' && d <= '9') || d === '+') {
        formattedPhoneNumber = formatter.inputDigit(d);
      }
    }
  }

  // If you enter a country code (e.g. +27), libphonenumber will always put a space after it. This interferes with
  // backspace. We trim formattedPhoneNumber in order to fix this.
  this.formGroup.get('phoneNumber')?.setValue(formattedPhoneNumber.trim(), { onlySelf: true });
}

/**
 * OnInit methods
 */

ngOnInit(): void {
  // Remove the countries that libphonenumber doesn't know about
  const unsupportedCountries = ['AQ', 'BV', 'GS', 'HM', 'PN', 'TF', 'UM'];
  this.countries = this.countries.filter(
    (country: Country): boolean => !unsupportedCountries.includes(country.cca2)
  );

  // Reduce the country list to just the those chosen by the caller
  if (this.countryWhitelist) {
    this.countries = this.countries.filter(
      (country: Country): boolean => this.countryWhitelist.includes(country.cca2)
    );
  }
  if (this.countryBlacklist) {
    this.countries = this.countries.filter(
      (country: Country): boolean => !this.countryBlacklist.includes(country.cca2)
    );
  }

  // Sort countries in English alphabetical order
  this.countries = this.countries.sort(
    (a, b) => a.name.common.localeCompare(b.name.common)
  );

  // Create a filtered list of countries based on the user's input
  this.filteredCountries = this.formGroup.get('countryFilter').valueChanges
    .pipe(
      startWith(''),
      map((input: string): Countries => this.filter(input))
    );

  // Set the default country
  let defaultCountry: any;
  if (this.defaultCountry) {
    defaultCountry = this.countries.find((el: Country): boolean => el.cca2 === this.defaultCountry);
  } else {
    defaultCountry = this.countries[0];
  }
  this.formGroup.get('country')?.setValue(defaultCountry);

  // Set example number
  this.placeholder = MkPhoneInputV1Component.getExampleNumber(defaultCountry);

  // Format the initial data passed to this widget
  const inputCountry: Country = this.formGroup.get('country')?.value as unknown as Country;
  const inputPhoneNumber: string = this.formGroup.get('phoneNumber')?.value;
  if (inputPhoneNumber) {
    const phoneNumberUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();
    const phoneNumber: PhoneNumber = phoneNumberUtil.parse(inputPhoneNumber, inputCountry.cca2);
    const formattedPhoneNumber: string = phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL);
    this.formGroup.get('phoneNumber')?.setValue(formattedPhoneNumber, { onlySelf: true });
  }

  // this.subscription.add(
  //   this.formGroup.get('phoneNumber')?.valueChanges.subscribe(() => this.stateChanges.next())
  // );
  // this.subscription.add(
  //   this.formGroup.get('country')?.valueChanges.subscribe(() => this.stateChanges.next())
  // );
}

/**
 * AfterViewInit methods
 */

ngAfterViewInit(): void {
  this.subscription.add(
    this.parentFormGroupDirective.ngSubmit.subscribe(e => {
      this.formGroupDirective.onSubmit(e);
      // this.stateChanges.next();
    })
  );
}

/**
 * DoCheck methods
 */

ngDoCheck(): void {
  if (this.ngControl) {
    if (this.formGroup.hasError('format')) {
      this.ngControl.control.setErrors({ format: true });
    }

    if (this.formGroup.hasError('country')) {
      this.ngControl.control.setErrors({ country: true });
    }

    const isTouched = this.formGroup.get('phoneNumber')?.touched;

    let isSubmitted = false;
    if (this.formGroupDirective) {
      isSubmitted = this.formGroupDirective.submitted;
    }

    this.errorState = (this.ngControl.invalid || this.formGroup.invalid) && (isTouched || isSubmitted);
    this.stateChanges.next();
  }
}

/**
 * OnDestroy methods
 */

ngOnDestroy(): void {
  this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  this.stateChanges.complete();
  this.subscription.unsubscribe();
}

/**
 * MatFormFieldControl methods
 */

setDescribedByIds(ids: string[]): void {
  this.describedBy = ids.join(' ');
}

onContainerClick(event: MouseEvent): void {
}

/**
 * ControlValueAccessor methods
 */

writeValue(obj: any): void {
  this.formGroup.get('phoneNumber')?.setValue(obj);
}

registerOnChange(fn: any): void {
  this.subscription.add(
    this.formGroup.get('outputPhoneNumber').valueChanges.subscribe(x => fn(x))
  );
}

registerOnTouched(fn: any): void {
  this.onTouched = fn;
}

setDisabledState?(isDisabled: boolean): void {
  if (isDisabled) {
    this.formGroup.disable();
  } else {
    this.formGroup.enable();
  }
}
}
