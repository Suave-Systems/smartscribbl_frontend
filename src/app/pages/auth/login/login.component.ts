import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
