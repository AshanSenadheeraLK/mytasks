import { Component, OnInit } from '@angular/core';
import { TimezoneService } from '../../services/timezone.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="dateTime">
      <p>Current Date and Time: {{ dateTime.datetime }}</p>
      <p>Timezone: {{ dateTime.timezone }}</p>
    </div>
  `
})
export class TimeDisplayComponent implements OnInit {
  dateTime: { datetime: string; timezone: string } | null = null;

  constructor(private timezoneService: TimezoneService) {}

  ngOnInit(): void {
    this.timezoneService.getCurrentDateTime().subscribe(data => {
      this.dateTime = data;
    });
  }
} 