import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialBoxComponent } from './testimonial-box.component';

describe('TestimonialBoxComponent', () => {
  let component: TestimonialBoxComponent;
  let fixture: ComponentFixture<TestimonialBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestimonialBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
