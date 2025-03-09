import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      } else if (control instanceof FormArray) {
        // control.markAllAsTouched()
        for (let index = 0; index < control.controls.length; index++) {
          const element = control.controls[index];
          element.markAsTouched();
          if (element instanceof FormControl) {
            //{4}
            element.markAsTouched({ onlySelf: true });
          } else if (element instanceof FormGroup) {
            //{5}
            this.validateAllFormFields(element); //{6}
          }
        }
      }
    });
  }
}
