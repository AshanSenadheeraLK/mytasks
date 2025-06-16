import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-version110',
  template: `
    <div class="version-container">
      <div class="version-header">
        <button class="back-button" (click)="navigateToAllVersions()">← Back to All Versions</button>
        <h1>Version 1.1.0</h1>
      </div>
      <div class="version-content">
        <section class="features">
          <h2>New Features</h2>
          <ul>
            <li>Enhanced UI/UX improvements</li>
            <li>Improved user interface</li>
            <li>Performance optimisations</li>
            <li>Added a new feature to view tasks</li>
            <li>Added "How to use" section to the home page to help users understand how to use the app</li>
          </ul>
        </section>
        <section class="release-notes">
          <h2>Release Notes</h2>
          <p style="text-align: justify;">Version 1.1.0 brings stability improvements and new features focused on enhancing the user experience. The updated UI/UX makes it easier to find and organize tasks. This release also includes performance optimizations for faster loading times and introduces a helpful "How to use" section to guide new users through the application's features of "Version 1.1.0".</p>
        </section>
      </div>
    </div>
    <style>
      .version-container {
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
      }
      .version-header {
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .back-button {
        padding: 8px 16px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      .back-button:hover {
        background: #1976D2;
      }
      h1 {
        margin: 0;
        color: #333;
      }
      .version-content {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      section {
        margin-bottom: 30px;
      }
      h2 {
        color: #2196F3;
        margin-bottom: 15px;
      }
      ul {
        list-style-type: disc;
        padding-left: 20px;
      }
      li {
        margin-bottom: 8px;
        color: #555;
      }
      p {
        color: #666;
        line-height: 1.6;
      }
    </style>
  `
})
export class Version110Component {
  constructor(private router: Router) {}

  navigateToAllVersions() {
    this.router.navigate(['/versions/all-versions']);
  }
} 