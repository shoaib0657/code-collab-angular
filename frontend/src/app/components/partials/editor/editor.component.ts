import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorComponent, CodemirrorModule } from '@ctrl/ngx-codemirror';
import { Socket } from 'socket.io-client';
import { ACTIONS } from '../../../constants/actions';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CodemirrorModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements AfterViewInit, OnDestroy {

  @Input()
  socket!: Socket;

  @Input()
  roomId!: string;

  @Output()
  code = new EventEmitter<string>();

  @ViewChild('editor') codemirrorComponent!: CodemirrorComponent;

  constructor() { }

  codeMirrorOptions: any = {
    mode: { name: 'javascript', json: true },
    theme: 'dracula',
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineNumbers: true,
  };

  ngAfterViewInit(): void {

    setTimeout(() => {

      console.log(this.codemirrorComponent);
      console.log(this.codemirrorComponent.codeMirror);

      if (this.codemirrorComponent && this.codemirrorComponent.codeMirror) {
        this.codemirrorComponent.codeMirror.on('change', (instance: any, changes: any) => {
          console.log('changes', changes);
          const { origin } = changes;
          const code = instance.getValue();

          // send this code to the parent component
          this.code.emit(code);

          if(origin !== 'setValue') {
            this.socket.emit(ACTIONS.CODE_CHANGE, {
              roomId: this.roomId,
              code,
            });
          }

          console.log('code', code);
        });
      } else {
        console.error('CodeMirror instance is not available.');
      }
      
      this.socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if(code !== null) {
          this.codemirrorComponent.codeMirror?.setValue(code);
        }
      })

    }, 0)
  }

  ngOnDestroy(): void {
    this.socket.off(ACTIONS.CODE_CHANGE);
  }
}
