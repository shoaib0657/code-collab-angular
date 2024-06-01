import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClientComponent } from '../../partials/client/client.component';
import { EditorComponent } from '../../partials/editor/editor.component';
import { SocketioService } from '../../../services/socketio.service';
import { ACTIONS } from '../../../constants/actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [CommonModule, ClientComponent, EditorComponent],
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.css'
})

export class EditorPageComponent implements OnInit, OnDestroy {

  roomId: string;
  username: string;
  clients: any[] = [];
  code: string = '';
  socket!: Socket;

  isCollapsed = false; // State for the collapsible pane

  constructor(
    private socketio: SocketioService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.roomId = this.route.snapshot.params['roomId'];
    const state = this.router.getCurrentNavigation()?.extras?.state;
    console.log('state', state);
    this.username = state?.['username'];
  }

  ngOnInit(): void {
    this.initSocketConnection();
  }

  ngOnDestroy(): void {
    this.cleanupSocketConnection();
  }

  private cleanupSocketConnection() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.off(ACTIONS.JOINED);
      this.socket.off(ACTIONS.DISCONNECTED);
      this.socket.off(ACTIONS.CODE_CHANGE);
      this.socket.off(ACTIONS.CURSOR_POSITION);
    }
  }

  private initSocketConnection(): void {
    this.socket = this.socketio.getSocket();

    this.socket.on('connect_error', (error) => {
      this.handleErrors(error);
    });
    this.socket.on('connect_failed', (error) => {
      this.handleErrors(error);
    });

    this.socket.emit(ACTIONS.JOIN, {
      roomId: this.roomId,
      username: this.username,
    });

    // Listening for joined event
    this.socket.on(ACTIONS.JOINED, (data) => {
      this.clients = data.clients;
      const { socketId, username } = data.newClient;

      if (username !== this.username) {
        this.toastr.success(`${username} joined the room`);
        console.log('new client joined', data);
      }

      this.socket.emit(ACTIONS.SYNC_CODE, {
        // send the current code to the new client
        code: this.code,
        socketId,
      })
    });

    // Listening for disconnected event
    this.socket.on(ACTIONS.DISCONNECTED, (data) => {
      const { socketId, username } = data;
      this.clients = this.clients.filter(
        (client) => client.socketId !== socketId
      );
      this.toastr.warning(`${username} left the room`);
      console.log('client disconnected', data);
    });
  }

  private handleErrors(error: any) {
    console.log('socket error', error);
    this.toastr.error('Socket connection failed, try again later.', 'Error');
    this.router.navigate(['/']);
  }

  async copyRoomId() {
    try {
      await navigator.clipboard.writeText(this.roomId);
      this.toastr.success('Room ID copied to clipboard');
    } catch (error) {
      this.toastr.error('Failed to copy room ID');
      console.error('Failed to copy room ID', error);
    }
  }

  leaveRoom(): void {
    this.router.navigate(['/']);
  } 

  received(code: string): void {
    this.code = code;
  }

  toggleAside(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
