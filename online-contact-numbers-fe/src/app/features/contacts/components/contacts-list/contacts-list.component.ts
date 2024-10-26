import { IContact } from './../../contact.interface';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { io, Socket } from 'socket.io-client';


@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    ConfirmDialogComponent
  ],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.css'
})
export default class ContactsListComponent implements OnInit, OnDestroy {
  private socket: Socket;
  contacts: IContact[] = [];
  page: number = 1;
  total: number = 0;

  constructor(
    private contactsService: ContactService,
    private router: Router,
    private toast: ToastrService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.socket = io('http://localhost:3000');
    this.handleSocketListeners();
  }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    this.contactsService.getContacts(this.page).subscribe({
      next: (res) => {
        this.contacts = res.contacts;
        this.total = res.total;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Can\'t get Contacts', 'Error');
      }
    });
  }

  editContact(contact: any): void {
    this.router.navigate([`contacts/form/${contact._id}`]);
  }

  confirmDelete(contact: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { name: contact.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteContact(contact);
      }
    });
  }

  deleteContact(contact: any): void {
    this.contactsService.deleteContact(contact._id).subscribe({
      next: () => {
        this.toast.success('Contact deleted Successfully', 'Success');
        this.getContacts();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Can\'t get Contacts', 'Error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.getContacts();
  }

  trackByContactId(index: number, contact: IContact): string {
    return contact._id!;
  }

  handleSocketListeners() :void{
    this.socket.on('contactLocked', (data: any) => {
      const contactIndex = this.contacts.findIndex(contact => contact._id === data.contactId);
      if (contactIndex !== -1){
        this.contacts = this.contacts.map((contact, index) => {
          if (index === contactIndex) {
            return { ...contact, locked: true};
          }
          return contact;
        });
        this.cdr.detectChanges();
      }
    });

    this.socket.on('contactUnlocked', (data: any) => {
      const contactIndex = this.contacts.findIndex(contact => contact._id === data.contactId);
      if (contactIndex !== -1){
        this.contacts = this.contacts.map((contact, index) => {
          if (index === contactIndex) {
            return { ...contact, locked: false};
          }
          return contact;
        });
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
