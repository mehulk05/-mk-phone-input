import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAgmCoreComponent } from './ng-agm-core.component';

describe('NgAgmCoreComponent', () => {
  let component: NgAgmCoreComponent;
  let fixture: ComponentFixture<NgAgmCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgAgmCoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgAgmCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
