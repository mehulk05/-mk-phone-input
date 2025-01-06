import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgIntlTelInputComponent } from './ng-intl-tel-input.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NativeElementInjectorDirective } from './directives/native-element-injector.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const dropdownModuleForRoot: ModuleWithProviders<BsDropdownModule> = BsDropdownModule.forRoot();


@NgModule({
  declarations: [
    NgIntlTelInputComponent,
    NativeElementInjectorDirective
  ],
  imports: [
    CommonModule,
		FormsModule,
		ReactiveFormsModule,
		dropdownModuleForRoot,
  ],
  exports: [
    NgIntlTelInputComponent,
    NativeElementInjectorDirective
  ]
})
export class NgIntlTelInputModule { }
