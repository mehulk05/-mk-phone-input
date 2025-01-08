import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgInternationalTelInputComponent } from './ng-international-tel-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NativeElementInjectorDirective } from './directives/native-element-injector.directive';

export const dropdownModuleForRoot: ModuleWithProviders<BsDropdownModule> = BsDropdownModule.forRoot();


@NgModule({
  declarations: [
    NgInternationalTelInputComponent,
    NativeElementInjectorDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    dropdownModuleForRoot,
  ],
  exports: [
    NgInternationalTelInputComponent,
    NativeElementInjectorDirective
  ]
})
export class NgInternationalTelInputModule { }
