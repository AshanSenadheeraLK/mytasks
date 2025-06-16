import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-version130',
  template: `
    <div class="version-container">
      <div class="version-header">
        <button class="back-button" (click)="navigateToAllVersions()">← Back to All Versions</button>
        <h1>Version 1.3.0</h1>
      </div>
      <div class="version-content">
        <section class="features">
          <h2>New Features</h2>
          <ul>
            <li>Introduced ability to select priority of tasks</li>
            <li>Advanced analytics</li>
            <li>Task tracking</li>
            <li>Enhanced mobile responsiveness</li>
            <li>Theme switching (light/dark)</li>
            <li>Device detection which is emits whether the client is mobile, tablet, or desktop and adjusts on window resize</li>
            <li>Search functionality offers filtering by title, description, priority, overdue status, and task state</li>
            <li>A session timeout mechanism automatically logs out inactive users after 10 minutes for security</li>
          </ul>
        </section>
        <section class="release-notes">
          <h2>Release Notes</h2>
          <p style="text-align: justify;">Version 1.3.0 introduces significant enhancements to task management with priority selection capabilities and advanced analytics for better productivity tracking. The improved mobile responsiveness ensures a seamless experience across all devices, complemented by our new device detection system that automatically optimizes the interface. Users can now enjoy personalized experiences with theme switching between light and dark modes. The powerful search functionality with multiple filtering options makes finding specific tasks effortless, while the session timeout feature adds an extra layer of security for your data.</p>
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
export class Version130Component {
  constructor(private router: Router) {}

  navigateToAllVersions() {
    this.router.navigate(['/versions/all-versions']);
  }
} 