import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingModeComponent } from './writing-mode.component';

describe('WritingModeComponent', () => {
  let component: WritingModeComponent;
  let fixture: ComponentFixture<WritingModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WritingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
