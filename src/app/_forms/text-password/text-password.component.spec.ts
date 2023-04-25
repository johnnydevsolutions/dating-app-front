import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPasswordComponent } from './text-password.component';

describe('TextPasswordComponent', () => {
  let component: TextPasswordComponent;
  let fixture: ComponentFixture<TextPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
