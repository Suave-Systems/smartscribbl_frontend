import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input('inputClass') inputClass = '';
  @Input('buttonDisabled') buttonDisabled = false;
  @Input() loading = false;
  @Output() buttonClick = new EventEmitter<any>();

  onButtonClick() {
    if (this.loading || this.buttonDisabled) {
      return;
    }
    this.buttonClick.emit();
  }
}
