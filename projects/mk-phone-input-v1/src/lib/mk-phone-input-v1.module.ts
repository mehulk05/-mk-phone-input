import { NgModule } from '@angular/core';
import { MkPhoneInputV1Component } from './mk-phone-input-v1.component';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';



@NgModule({
  declarations: [
    MkPhoneInputV1Component
  ],
  imports: [
    MatInputModule,
    CommonModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
  ],
  exports: [
    MkPhoneInputV1Component
  ],
   providers: [
      { provide: MatFormFieldControl, useExisting: MkPhoneInputV1Component },
    ],
})
export class MkPhoneInputV1Module { }
