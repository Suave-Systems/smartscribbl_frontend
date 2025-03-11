import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiToneComponent } from './ai-tone.component';

describe('AiToneComponent', () => {
  let component: AiToneComponent;
  let fixture: ComponentFixture<AiToneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiToneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiToneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
