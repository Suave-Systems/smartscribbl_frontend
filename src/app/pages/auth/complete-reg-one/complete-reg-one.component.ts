import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-complete-reg-one',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './complete-reg-one.component.html',
  styleUrl: './complete-reg-one.component.scss',
})
export class CompleteRegOneComponent {
  options: any[] = ['work', 'school', 'Other Projects'];
}
