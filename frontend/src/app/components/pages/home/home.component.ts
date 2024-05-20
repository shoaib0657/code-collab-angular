import { Component } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private toastr: ToastrService, private router: Router) {}

  roomId: string = '';
  username: string = '';

  createNewRoom(event: Event) {
    event.preventDefault();
    this.roomId = uuid();
    this.toastr.success('Room created successfully');
  }

  joinRoom() {
    if (this.roomId === '') {
      this.toastr.error('Please enter a room ID');
      return;
    }
    if (this.username === '') {
      this.toastr.error('Please enter a username');
      return;
    }
    this.toastr.success('Joining room');

    // Redirect to the editor page
    this.router.navigate([`/editor/${this.roomId}`], {
      state: { username: this.username },
    });
  }

  handleEnterKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.joinRoom();
    }
  }
}
