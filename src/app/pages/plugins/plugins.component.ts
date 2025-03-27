import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-plugins',
  standalone: true,
  imports: [ButtonComponent, PageTitleComponent],
  templateUrl: './plugins.component.html',
  styleUrl: './plugins.component.scss',
})
export class PluginsComponent {}
