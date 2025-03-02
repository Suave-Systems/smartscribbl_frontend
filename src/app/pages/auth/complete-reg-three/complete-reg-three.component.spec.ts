import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRegThreeComponent } from './complete-reg-three.component';

describe('CompleteRegThreeComponent', () => {
  let component: CompleteRegThreeComponent;
  let fixture: ComponentFixture<CompleteRegThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteRegThreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteRegThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
