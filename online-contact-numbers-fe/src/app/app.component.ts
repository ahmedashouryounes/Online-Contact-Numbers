import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { ContactService } from './features/contacts/services/contact.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  private socket: Socket;

  constructor(private contactsService: ContactService) {
    this.socket = io('http://localhost:3000');
    this.handleSocketListeners();
  }

  handleSocketListeners(): void {
    this.socket.on('contactLocked', (data: any) => {
      this.contactsService.newChanges.next(1);
    });

    this.socket.on('contactUnlocked', (data: any) => {
      this.contactsService.newChanges.next(1);
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
