import { Component } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor() { }

  roomId: string = '';
  username: string = '';

  createNewRoom(event: Event) {
    event.preventDefault();
    this.roomId = uuid();
  }

}
