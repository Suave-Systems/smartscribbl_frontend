import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  selectedAudience = '';
  selectedTone = '';
  selectedContext = '';
  selectedGoal = '';
  selectedEnglish = '';
  data: { mode: 'edit' | 'new' } = inject(MAT_DIALOG_DATA);
  private selectedWritingOption = computed(() => {
    this.selectedAudience = this.writingService.writingOptions()
      ?.audient_type as string;
    this.selectedTone = this.writingService.writingOptions()
      ?.tone_type as string;
    this.selectedContext = this.writingService.writingOptions()
      ?.context_type as string;
    this.selectedGoal = this.writingService.writingOptions()
      ?.goal_type as string;
    this.selectedEnglish = this.writingService.writingOptions()
      ?.english_type as string;

    return this.writingService.writingOptions();
  });

  constructor() {
    effect(() => {
      this.selectedWritingOption();
    });
  }

  ngOnInit(): void {
    this.getWritingOptions();
  }

  ngOnDestroy(): void {}

  saveWritingOption() {
    const preferredOptions: PreferredWritingOption = {
      audient_type: this.selectedAudience,
      tone_type: this.selectedTone,
      context_type: this.selectedContext,
      goal_type: this.selectedGoal,
      english_type: this.selectedEnglish,
    };
    this.writingService.setWritingOptions(preferredOptions);
    this.dialogRef.close();
    this.data.mode === 'new' && this.router.navigate(['/main/create-article']);
  }

  getWritingOptions() {
    this.writingService.getWritingOptions().subscribe({
      next: (response) => {
        this.writingOption = response.data;
        this.data.mode === 'new' && this.onResetDefault();
      },
    });
  }

  onResetDefault() {
    this.selectedAudience = this.writingOption?.audience_types.find(
      (audience) => audience.is_default
    )?.key as string;
    this.selectedTone = this.writingOption?.tone_types.find(
      (tone) => tone.is_default
    )?.key as string;
    this.selectedContext = this.writingOption?.context_types.find(
      (context) => context.is_default
    )?.key as string;
    this.selectedGoal = this.writingOption?.goal_types.find(
      (goal) => goal.is_default
    )?.key as string;
    this.selectedEnglish = this.writingOption?.english_types.find(
      (english) => english.is_default
    )?.key as string;
  }

  onSelectAudience(value: Datum) {
    this.selectedAudience = value.key;
  }

  onSelectTone(value: Datum) {
    this.selectedTone = value.key;
  }

  onSelectContext(value: Datum) {
    this.selectedContext = value.key;
  }

  onSelectGoal(value: Datum) {
    this.selectedGoal = value.key;
  }

  onSelectEnglish(value: Datum) {
    this.selectedEnglish = value.key;
  }
}
