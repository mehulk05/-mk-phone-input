import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkPhoneInputComponent } from './mk-phone-input.component';

describe('MkPhoneInputComponent', () => {
  let component: MkPhoneInputComponent;
  let fixture: ComponentFixture<MkPhoneInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MkPhoneInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MkPhoneInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
