import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-smart-editor',
  templateUrl: './smart-editor.component.html',
  styleUrls: ['./smart-editor.component.scss'],
  imports: [FormsModule], // You can add specific styles here if needed
})
export class SmartEditorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
