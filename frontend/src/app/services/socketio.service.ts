import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BASE_URL } from '../constants/urls';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket: Socket;

  constructor() {
    this.socket = io(BASE_URL, {
      forceNew: true,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ['websocket'],
    });
  }

  getSocket(): Socket {
    return this.socket;
  }

  emitEvent(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
