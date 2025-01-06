import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkPhoneInputV1Component } from './mk-phone-input-v1.component';

describe('MkPhoneInputV1Component', () => {
  let component: MkPhoneInputV1Component;
  let fixture: ComponentFixture<MkPhoneInputV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MkPhoneInputV1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MkPhoneInputV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
