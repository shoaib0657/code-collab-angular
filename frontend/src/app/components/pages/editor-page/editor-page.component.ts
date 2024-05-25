import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClientComponent } from '../../partials/client/client.component';
import { EditorComponent } from '../../partials/editor/editor.component';
import { SocketioService } from '../../../services/socketio.service';
import { ACTIONS } from '../../../constants/actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    this.socketio.getSocket().disconnect();
    this.socketio.getSocket().off(ACTIONS.JOINED);
    this.socketio.getSocket().off(ACTIONS.DISCONNECTED);
  }

  initSocketConnection(): void {
    const socket = this.socketio.getSocket();

    socket.on('connect_error', (error) => {
      this.handleErrors(error);
    });
    socket.on('connect_failed', (error) => {
      this.handleErrors(error);
    });

    this.socketio.emitEvent(ACTIONS.JOIN, {
      roomId: this.roomId,
      username: this.username,
    });

    // Listening for joined event
    socket.on(ACTIONS.JOINED, (data) => {
      this.clients = data.clients;
      const socketId = data.newClient.socketId;
      const username = data.newClient.username;

      if (username !== this.username) {
        this.toastr.success(`${username} joined the room`);
        console.log('new client joined', data);
      }
    });

    // Listening for disconnected event
    socket.on(ACTIONS.DISCONNECTED, (data) => {
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
}
