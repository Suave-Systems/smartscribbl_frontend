import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { FeatureBoxComponent } from './feature-box/feature-box.component';
import { TestimonialBoxComponent } from './testimonial-box/testimonial-box.component';
import { FooterNavComponent } from '../../shared/footer-nav/footer-nav.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ButtonComponent,
    FeatureBoxComponent,
    TestimonialBoxComponent,
    FooterNavComponent,
    FooterComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
