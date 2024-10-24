import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {
  loginForm!: FormGroup;
  isLoading = false;
  submitted = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.formInit()
  }

  formInit(){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get f() { 
    return this.loginForm.controls; 
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.toast.success('Login successful!', 'Success');
          this.router.navigate(['/contacts']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toast.error(err.error?.message || 'Login failed', 'Error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.toast.warning('Please fill in all required fields', 'Warning');
    }
  }
}
