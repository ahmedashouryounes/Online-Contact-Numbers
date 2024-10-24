import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { IContact } from '../../contact.intterface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacts-form.component.html',
  styleUrl: './contacts-form.component.css'
})
export default class ContactsFormComponent implements OnInit {
  contactForm!: FormGroup;
  contactId: string | null = null;
  isEditMode = false;
  isLoading = false;
  submitted = false;

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
        this.contactForm.patchValue(contact);
      },
      error: (err: any) => {
        this.router.navigate(['/contacts']);
        this.toast.error(err.error?.message || 'Contact Not found', 'Error');
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      this.isLoading = true;
      if (this.isEditMode) {
        this.contactsService.updateContact(this.contactId!, this.contactForm.value).subscribe({
          next: () => {
            this.router.navigate(['/contacts']);
            this.toast.success('Contact Updated Successfully!', 'Success');
          },
          error: (err) => {
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
            this.toast.error(err.error?.message || 'Added failed', 'Error');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    } else { this.toast.warning('Please fill in all required fields', 'Warning'); }
  }
}
