import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/input/input.component';

@Component({
  selector: 'app-complete-reg-two',
  standalone: true,
  imports: [ButtonComponent, InputComponent, RouterLink],
  templateUrl: './complete-reg-two.component.html',
  styleUrl: './complete-reg-two.component.scss',
})
export class CompleteRegTwoComponent {}
