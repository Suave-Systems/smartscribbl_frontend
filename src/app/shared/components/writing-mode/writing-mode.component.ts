import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { WritingService } from '../../services/writing.service';
import {
  Datum,
  PreferredWritingOption,
  WritingOption,
} from '../../../models/api-responses';
import { Router } from '@angular/router';

@Component({
  selector: 'app-writing-mode',
  standalone: true,
  imports: [MatDialogModule, ButtonComponent],
  templateUrl: './writing-mode.component.html',
  styleUrl: './writing-mode.component.scss',
})
export class WritingModeComponent implements OnInit, OnDestroy {
  private writingService = inject(WritingService);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<WritingModeComponent>);
  writingOption: WritingOption | undefined = undefined;
  selectedAudience: Datum | undefined = undefined;
  selectedTone: Datum | undefined = undefined;
  selectedContext: Datum | undefined = undefined;
  selectedGoal: Datum | undefined = undefined;
  selectedEnglish: Datum | undefined = undefined;
  data: { mode: 'edit' | 'new' } = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.getWritingOptions();
  }

  ngOnDestroy(): void {}

  saveWritingOption() {
    const preferredOptions: PreferredWritingOption = {
      audient_type: this.selectedAudience?.key,
      tone_type: this.selectedTone?.key,
      context_type: this.selectedContext?.key,
      goal_type: this.selectedGoal?.key,
      english_type: this.selectedEnglish?.key,
    };
    this.writingService.setWritingOptions(preferredOptions);
    this.dialogRef.close();
    this.data.mode === 'new' && this.router.navigate(['/main/create-article']);
  }

  getWritingOptions() {
    this.writingService.getWritingOptions().subscribe({
      next: (response) => {
        this.writingOption = response.data;
        this.onResetDefault();
      },
    });
  }

  onResetDefault() {
    this.selectedAudience = this.writingOption?.audience_types.find(
      (audience) => audience.is_default
    );
    this.selectedTone = this.writingOption?.tone_types.find(
      (tone) => tone.is_default
    );
    this.selectedContext = this.writingOption?.context_types.find(
      (context) => context.is_default
    );
    this.selectedGoal = this.writingOption?.goal_types.find(
      (goal) => goal.is_default
    );
    this.selectedEnglish = this.writingOption?.english_types.find(
      (english) => english.is_default
    );
  }

  onSelectAudience(audience: Datum) {
    this.selectedAudience = audience;
  }

  onSelectTone(audience: Datum) {
    this.selectedTone = audience;
  }

  onSelectContext(audience: Datum) {
    this.selectedContext = audience;
  }

  onSelectGoal(audience: Datum) {
    this.selectedGoal = audience;
  }

  onSelectEnglish(audience: Datum) {
    this.selectedEnglish = audience;
  }
}
