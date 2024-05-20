import { Component } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private toastr: ToastrService) { }

  roomId: string = '';
  username: string = '';

  createNewRoom(event: Event) {
    event.preventDefault();
    this.roomId = uuid();
    this.toastr.success('Room created successfully');
  }

}
