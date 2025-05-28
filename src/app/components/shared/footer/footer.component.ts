import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent {
  title = 'MY TASKS - Task Management System';
  description = 'A task management system that helps you manage your tasks and get things done.';

  currentYear = new Date().getFullYear();

  socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/ashan.senadheera.2025',
      icon: 'bi bi-facebook'
    },
    {
      name: 'Website',
      url: 'http://ashansenadheera.lk',
      icon: 'bi bi-globe'
    }
  ];

  showBackToTop = false;

  constructor() {
    // Listen for scroll to handle back to top button
    window.addEventListener('scroll', () => {
      this.showBackToTop = window.scrollY > 200;
    });
  }

  backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
