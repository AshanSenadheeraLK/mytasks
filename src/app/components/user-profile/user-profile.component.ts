import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = null;
  loading = true;
  updateSuccess = false;
  updateError = '';

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Ensure authentication is ready before checking user
    this.authService.authReady.then(() => {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/']);
        return;
      }
      
      this.authService.user$.subscribe(user => {
        if (user) {
          console.log('User profile loaded:', user);
          this.user = user;
          this.profileForm.patchValue({
            email: user.email || '',
            displayName: user.displayName || ''
          });
        } else {
          console.log('No user found, redirecting to login');
          // Redirect to login if not authenticated
          this.router.navigate(['/']);
        }
        this.loading = false;
      });
    });
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      try {
        this.loading = true;
        const displayName = this.profileForm.value.displayName;
        console.log('Updating profile with display name:', displayName);
        
        // Use the direct method to update display name
        await this.authService.updateDisplayName(displayName);
        
        // Update local user object to reflect changes immediately
        if (this.user) {
          this.user.displayName = displayName;
        }
        
        this.updateSuccess = true;
        this.updateError = '';
      } catch (error: any) {
        console.error('Profile update error:', error);
        
        // Check if the Firebase Auth profile was updated but Firestore failed
        // If so, we'll still consider it a success for UX purposes
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.displayName === this.profileForm.value.displayName) {
          this.updateSuccess = true;
          this.updateError = 'Your display name was updated, but there was an error saving additional data.';
        } else {
          this.updateSuccess = false;
          this.updateError = error.message || 'Failed to update profile';
        }
      } finally {
        this.loading = false;
      }
    }
  }

  navigateToApp() {
    this.router.navigate(['/app']);
  }
} 