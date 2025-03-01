import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {}
