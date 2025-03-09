import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FeatureBoxComponent } from './feature-box/feature-box.component';
import { TestimonialBoxComponent } from './testimonial-box/testimonial-box.component';
import { FooterNavComponent } from '../../shared/components/footer-nav/footer-nav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ButtonComponent,
    FeatureBoxComponent,
    TestimonialBoxComponent,
    FooterNavComponent,
    NavComponent,
    FooterComponent,
    RouterLink,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
