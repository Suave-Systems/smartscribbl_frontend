import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor() {}
  private dialog = inject(MatDialog);
  openDialog(
    component: any,
    // component: ComponentType<any>,
    config: MatDialogConfig<any> = { disableClose: false }
  ) {
    return this.dialog.open(component, {
      panelClass: 'scribbl-dialog',
      ...config,
    });
  }
}
