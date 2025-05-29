import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Or your preferred build
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-smart-editor',
  templateUrl: './smart-editor.component.html',
  styleUrls: ['./smart-editor.component.scss'],
  imports: [CKEditorModule, FormsModule], // You can add specific styles here if needed
})
export class SmartEditorComponent implements OnInit {
  public Editor: any = ClassicEditor;
  public editorData: string = '<p>Type or Paste (Ctrl+V) your text here</p>'; // Initial content
  public editorConfig: any = {
    toolbar: [
      // We will manage the toolbar visually via the custom footer
      // but you might want some core plugins enabled.
      // This can be left minimal if the custom bar handles all actions.
    ],
    placeholder: 'Type or Paste (Ctrl+V) your text here',
    // Remove the default CKEditor toolbar
    // We are creating a custom one in the footer
    toolbarLocation: 'bottom', // This might not completely hide it with all builds,
    // custom CSS might be needed if a remnant toolbar appears.
  };

  public wordCount: number = 0;
  private editorInstance: any;

  @ViewChild('editorComponent') editorComponent!: CKEditorComponent;
  @ViewChild('customToolbar') customToolbar!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.updateWordCount(this.editorData);
  }

  public onReady(editor: any): void {
    this.editorInstance = editor;
    // Hides the default CKEditor toolbar
    const toolbarElement = editor.ui.view.toolbar.element;
    if (toolbarElement) {
      toolbarElement.style.display = 'none';
    }
    console.log('CKEditor5 is ready.', editor);
    this.updateWordCount(this.editorData);
  }

  public onChange({ editor }: ChangeEvent): void {
    const data = editor.getData();
    this.editorData = data;
    this.updateWordCount(data);
    // console.log(data);
  }

  private updateWordCount(text: string): void {
    if (!text) {
      this.wordCount = 0;
      return;
    }
    // Strip HTML tags and count words
    const plainText = text.replace(/<[^>]*>/g, ' ').trim();
    const words = plainText.split(/\s+/).filter((word) => word.length > 0);
    this.wordCount = words.length;
    if (plainText.length === 0) {
      // Adjust for empty editor after clearing
      this.wordCount = 0;
    }
  }

  // --- Custom Toolbar Actions ---
  executeCommand(commandName: string, value?: any): void {
    if (this.editorInstance) {
      if (value) {
        this.editorInstance.execute(commandName, value);
      } else {
        this.editorInstance.execute(commandName);
      }
      this.editorInstance.editing.view.focus();
    }
  }

  toggleHeading(level: string): void {
    if (this.editorInstance) {
      const currentHeading = this.editorInstance.commands.get('heading').value;
      if (currentHeading === level) {
        this.editorInstance.execute('paragraph'); // Toggle off to paragraph
      } else {
        this.editorInstance.execute('heading', { value: level });
      }
      this.editorInstance.editing.view.focus();
    }
  }

  // Basic link - CKEditor's link feature is more robust (requires Link plugin)
  // For a simple implementation, you might need to extend this or use the built-in features
  // if the Link plugin is part of your build and you enable its UI.
  addLink(): void {
    if (this.editorInstance) {
      const url = prompt('Enter the URL:');
      if (url) {
        this.editorInstance.execute('link', url);
        this.editorInstance.editing.view.focus();
      }
    }
  }
}
