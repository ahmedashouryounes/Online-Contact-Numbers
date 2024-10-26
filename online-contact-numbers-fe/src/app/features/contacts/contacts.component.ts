import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [RouterOutlet, NgIf, MatIconModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export default class ContactsComponent implements OnInit{
  user :string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(){
    this.getUser();
  }

  getUser(): void{
    this.user = this.authService.getUser();
  }

  addContact(): void{
    this.router.navigate(['contacts/form']);
  }

  backToList(): void{
    this.router.navigate(['contacts']);
  }

  logout() : void{
    this.authService.logout()
  }

  getPathName() :string{
    return window.location.href;
  }
}
