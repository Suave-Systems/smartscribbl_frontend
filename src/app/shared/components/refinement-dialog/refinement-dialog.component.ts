import { Component, Inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-refinement-dialog',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './refinement-dialog.component.html',
  styleUrl: './refinement-dialog.component.scss',
})
export class RefinementDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RefinementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onAcceptChange() {
    this.dialogRef.close({ accept: true, data: this.data.refinedText });
  }

  onDismissChange() {
    this.dialogRef.close({ accept: false, data: this.data.refinedText });
  }
}
