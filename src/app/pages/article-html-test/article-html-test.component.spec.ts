import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleHtmlTestComponent } from './article-html-test.component';

describe('ArticleHtmlTestComponent', () => {
  let component: ArticleHtmlTestComponent;
  let fixture: ComponentFixture<ArticleHtmlTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleHtmlTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleHtmlTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
