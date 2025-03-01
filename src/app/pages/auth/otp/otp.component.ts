import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { RouterLink } from '@angular/router';
import { NgOtpInputComponent } from 'ng-otp-input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    ButtonComponent,
    RouterLink,
    NgOtpInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent {
  otp = new FormControl('');
}
