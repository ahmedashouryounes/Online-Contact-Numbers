import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { IContact } from '../../contact.interface';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-contacts-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './contacts-form.component.html',
  styleUrl: './contacts-form.component.css'
})
export default class ContactsFormComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  contactId: string | null = null;
  oldContact: IContact = {
    name: '',
    phone: '',
    address: '',
    notes: ''
  }
  isEditMode = false;
  isLoading = false;
  submitted = false;
  timer: number = 120;
  interval: any;

  constructor(
    private fb: FormBuilder,
    private contactsService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.formInit()
    this.route.paramMap.subscribe(params => {
      this.contactId = params.get('id');
      if (this.contactId) {
        this.isEditMode = true;
        this.getContact(this.contactId);
        this.lockContact(this.contactId);
        this.startTimer();
      }
    });
  }

  formInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      notes: ['', Validators.required]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  getContact(id: string): void {
    this.contactsService.getContactById(id).subscribe({
      next: (contact: IContact) => {
        this.fillOldContact(contact);
        this.contactForm.patchValue(contact);
      },
      error: (err: any) => {
        this.router.navigate(['/contacts']);
        this.toast.error(err.error?.message || 'Contact Not found', 'Error');
      }
    });
  }

  fillOldContact(contact: IContact): void {
    this.oldContact["name"] = contact["name"];
    this.oldContact["phone"] = contact["phone"];
    this.oldContact["address"] = contact["address"];
    this.oldContact["notes"] = contact["notes"];
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      this.isLoading = true;
      if (this.isEditMode) {
        if (JSON.stringify(this.oldContact) == JSON.stringify(this.contactForm.getRawValue())) {
          this.toast.warning('You never change any field', 'Warning');
          this.isLoading = false;
          return;
        }
        this.contactsService.updateContact(this.contactId!, this.contactForm.value).subscribe({
          next: () => {
            this.router.navigate(['/contacts']);
            this.toast.success('Contact Updated Successfully!', 'Success');
          },
          error: (err) => {
            this.isLoading = false;
            this.toast.error(err.error?.message || 'Updated failed', 'Error');
          },
          complete: () => {
            this.isLoading = false;
          }
        }
        );
      } else {
        this.contactsService.AddContact(this.contactForm.value).subscribe({
          next: () => {
            this.router.navigate(['/contacts']);
            this.toast.success('Contact Added Successfully!', 'Success');
          },
          error: (err) => {
            this.isLoading = false;
            this.toast.error(err.error?.message || 'Added failed', 'Error');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    } else { this.toast.warning('Please fill in all required fields', 'Warning'); }
  }

  lockContact(id: string): void {
    this.contactsService.lockContact(id).subscribe({
      next: () => {
        this.toast.warning('Contact will locked for 2 Minute', 'Warning');
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Can\'t locked this contact', 'Error');
      }
    })
  }

  unlockContact(id: string): void {
    this.contactsService.unlockContact(id).subscribe({
      next: () => {
        this.toast.warning('Contact will unlocked', 'Warning');
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Can\'t unlocked this contact', 'Error');
      }
    });
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.interval);
        this.unlockContact(this.contactId || "");
        this.router.navigate(['/contacts']);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    if (this.contactId) {
      clearInterval(this.interval);
      this.unlockContact(this.contactId || "");
    }
  }

}
