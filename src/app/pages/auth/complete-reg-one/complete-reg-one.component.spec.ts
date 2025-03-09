import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRegOneComponent } from './complete-reg-one.component';

describe('CompleteRegOneComponent', () => {
  let component: CompleteRegOneComponent;
  let fixture: ComponentFixture<CompleteRegOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteRegOneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteRegOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
