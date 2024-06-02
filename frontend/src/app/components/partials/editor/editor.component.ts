import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements AfterViewInit, OnDestroy {

  @Input() socket!: Socket;
  @Input() roomId!: string;
  @Output() code = new EventEmitter<string>();

  @ViewChild('editor') codemirrorComponent!: CodemirrorComponent;

  private cursorMarkers: { [key: string]: any } = {}; // socketId: marker
  private cursorColors: { [key: string]: string } = {}; // socketId: color
  private usernames: { [key: string]: string } = {}; // socketId: username

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

        const codeMirrorInstance = this.codemirrorComponent.codeMirror;

        codeMirrorInstance.on('change', (instance: any, changes: any) => {
          console.log('changes', changes);
          const { origin } = changes;
          const code = instance.getValue();

          // send this code to the parent component
          this.code.emit(code);

          if (origin !== 'setValue') {
            this.socket.emit(ACTIONS.CODE_CHANGE, {
              roomId: this.roomId,
              code,
            });
          }
          console.log('code', code);
        });

        codeMirrorInstance.on('cursorActivity', () => {
          const cursor = codeMirrorInstance.getCursor();
          this.socket.emit(ACTIONS.CURSOR_POSITION, {
            roomId: this.roomId,
            cursor,
          });
        })

        this.socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
          if (code !== null && codeMirrorInstance.getValue() !== code) {
            const cursor = codeMirrorInstance.getCursor(); // Save the cursor position
            codeMirrorInstance.setValue(code);
            codeMirrorInstance.setCursor(cursor); // Restore the cursor position
          }
        })

        this.socket.on(ACTIONS.CURSOR_POSITION, ({ cursor, socketId, username }) => {
          // Update the cursor position for other clients
          if (socketId !== this.socket.id) {
            this.usernames[socketId] = username;
            this.updateClientCursor(socketId, cursor);
          }
        })

        this.socket.on(ACTIONS.DISCONNECTED, ({ socketId }) => {
          this.removeClientCursor(socketId);
        })

      } else {
        console.log('codemirror not initialized');
      }

    }, 0)
  }

  ngOnDestroy(): void {
    this.socket.off(ACTIONS.CODE_CHANGE);
    this.socket.off(ACTIONS.CURSOR_POSITION);
  }

  private updateClientCursor(socketId: string, cursor: any) {
    console.log('cursor', cursor);
    console.log('socketId', socketId);

    const codeMirrorInstance = this.codemirrorComponent.codeMirror!;

    if (this.cursorMarkers[socketId]) {
      this.cursorMarkers[socketId].clear();
    }

    if (!this.cursorColors[socketId]) {
      this.cursorColors[socketId] = this.generateColor(socketId);
    }

    const cursorElement = document.createElement('span');
    cursorElement.style.borderLeftColor = this.cursorColors[socketId];
    cursorElement.classList.add('cursorElement');

    const cursorName = document.createTextNode(this.usernames[socketId] || 'User');
    const cursorFlag = document.createElement('span');
    cursorFlag.classList.add('cursorFlag');
    cursorFlag.style.backgroundColor = this.cursorColors[socketId];
    cursorFlag.appendChild(cursorName);
    cursorElement.appendChild(cursorFlag);

    const marker = codeMirrorInstance.setBookmark(cursor, { widget: cursorElement });
    this.cursorMarkers[socketId] = marker;
  }

  private removeClientCursor(socketId: string) {
    if (this.cursorMarkers[socketId]) {
      this.cursorMarkers[socketId].clear();
      delete this.cursorMarkers[socketId];
      delete this.cursorColors[socketId];
      delete this.usernames[socketId];
    }
  }

  private generateColor(socketId: string): string {
    // Simple hash function to generate a color based on the socketId
    let hash = 0;
    for (let i = 0; i < socketId.length; i++) {
      hash = socketId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}`;
    return color;
  }
}
