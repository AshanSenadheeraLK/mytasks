import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-version200',
  template: `
    <div class="version-container">
      <div class="version-header">
        <button class="back-button" (click)="navigateToAllVersions()">← Back to All Versions</button>
        <h1>Version 2.0.0</h1>
      </div>
      <div class="version-content">
        <section class="features">
          <h2>Major New Features</h2>
          <ul>
            <li>Complete UI/UX redesign</li>
            <li>Real-time collaboration</li>
            <li>Advanced workflow automation</li>
            <li>Integration with popular third-party tools</li>
            <li>Enhanced security features</li>
            <li>Custom dashboard creation</li>
          </ul>
        </section>
        <section class="release-notes">
          <h2>Release Notes</h2>
          <p style="text-align: justify;">Version 2.0.0 represents a major milestone with a complete overhaul of the user interface and significant improvements to the underlying architecture. The new real-time collaboration features and workflow automation capabilities make this our most powerful release yet.</p>
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
export class Version200Component {
  constructor(private router: Router) {}

  navigateToAllVersions() {
    this.router.navigate(['/versions/all-versions']);
  }
} 