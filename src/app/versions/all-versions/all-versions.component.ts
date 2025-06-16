import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-versions',
  template: `
    <div class="versions-container">
      <div class="version-header">
        <button class="back-button" (click)="navigateToHome()">← Back to Home</button>
      <h2>All Available Versions</h2>
      <div class="version-list">
        <div class="version-card" *ngFor="let version of versions" (click)="navigateToVersion(version.path)">
          <h3>Version {{ version.name }}</h3>
          <p>{{ version.description }}</p>
        </div>
      </div>
    </div>
    <style>
      .versions-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .version-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      .version-card {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .version-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      h2 {
        color: #333;
        text-align: center;
        margin-bottom: 30px;
      }
      h3 {
        color: #2196F3;
        margin: 0 0 10px 0;
      }
      p {
        color: #666;
        margin: 0;
      }
    </style>
  `
})
export class AllVersionsComponent {
navigateToHome() {
  this.router.navigate(['/']);
}
  versions = [
    { name: '2.0.0', path: '2.0.0', description: 'Latest major release with significant improvements' },
    { name: '1.3.0', path: '1.3.0', description: 'Minor update with bug fixes and performance improvements' },
    { name: '1.2.0', path: '1.2.0', description: 'Feature update with new functionality' },
    { name: '1.1.0', path: '1.1.0', description: 'Stability improvements and minor features' },
    { name: '1.0.0', path: '1.0.0', description: 'Initial release version' }
  ];

  constructor(private router: Router) {}

  navigateToVersion(path: string) {
    this.router.navigate(['/versions', path]);
  }
} 