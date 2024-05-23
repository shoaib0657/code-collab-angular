import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'ngx-avatars';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [AvatarModule, HttpClientModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

  constructor() { }

  @Input()
  username!: string;

}
