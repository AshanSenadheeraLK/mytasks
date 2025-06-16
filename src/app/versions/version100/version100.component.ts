import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-version100',
  template: `
    <div class="version-container">
      <div class="version-header">
        <button class="back-button" (click)="navigateToAllVersions()">← Back to All Versions</button>
        <h1>Version 1.0.0</h1>
      </div>
      <div class="version-content">
        <section class="features">
          <h2>Initial Release Features</h2>
          <ul>
            <li>Basic task management functionality</li>
            <li>User authentication system</li>
          </ul>
        </section>
        <section class="release-notes">
          <h2>Release Notes</h2>
          <p style="text-align: justify;">This is the initial release version of our task management system. It includes core functionality needed for basic task management and user operations.</p>
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
export class Version100Component {
  constructor(private router: Router) {}

  navigateToAllVersions() {
    this.router.navigate(['/versions/all-versions']);
  }
} 