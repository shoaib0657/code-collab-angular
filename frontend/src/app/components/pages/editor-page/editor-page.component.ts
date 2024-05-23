import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClientComponent } from '../../partials/client/client.component';
import { EditorComponent } from '../../partials/editor/editor.component';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [CommonModule, ClientComponent, EditorComponent],
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.css'
})
export class EditorPageComponent {

  constructor() { }

  clients: any = [
    {
      socketId: 1,
      username: 'shoaib',
    },
    {
      socketId: 2,
      username: 'John Doe',
    }
  ]

}
