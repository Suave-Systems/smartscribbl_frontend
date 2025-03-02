import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRegTwoComponent } from './complete-reg-two.component';

describe('CompleteRegTwoComponent', () => {
  let component: CompleteRegTwoComponent;
  let fixture: ComponentFixture<CompleteRegTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteRegTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteRegTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
