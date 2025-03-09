import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input('control') control!: FormControl;
  @Input('inputClass') inputClass = '';
  @Input('label') label!: string;
  @Input('type') type: 'text' | 'password' | 'email' = 'text';
  @Input('placeholder') placeholder: string = '';
}
