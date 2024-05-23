import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CodemirrorModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit {
  constructor() {}

  codeMirrorOptions: any = {
    mode: { name: 'javascript', json: true},
    theme: 'dracula',
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineNumbers: true,

    // indentWithTabs: true,
    // smartIndent: true,
    
    // lineWrapping: false,
    // extraKeys: { 'Ctrl-Space': 'autocomplete' },
    // gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    // matchBrackets: true,
    // lint: true,
  };

  content!: string;

  ngOnInit() {
    this.content = ``;
    console.log(this.content);
  }
  setEditorContent(event: any) {
    // console.log(event, typeof event);
    console.log(this.content);
  }
}
