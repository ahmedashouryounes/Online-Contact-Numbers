import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export default class ContactsComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }



  addContact(){
    this.router.navigate(['contacts/form']);
  }

  backToList(){
    this.router.navigate(['contacts']);
  }

  logout() {
    this.authService.logout()
  }

  getPathName() {
    return window.location.href;
  }
}
