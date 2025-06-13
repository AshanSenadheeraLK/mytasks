import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

interface IpApiResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

interface TimeApiResponse {
  datetime: string;
  timezone: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  private ipApiUrl = 'https://ipapi.co/json/';
  private timeApiUrl = 'https://worldtimeapi.org/api/timezone/';

  constructor(private http: HttpClient) {}

  getCurrentDateTime(): Observable<{ datetime: string; timezone: string }> {
    return this.http.get<IpApiResponse>(this.ipApiUrl).pipe(
      map(ipData => ipData.timezone),
      map(timezone => this.http.get<TimeApiResponse>(`${this.timeApiUrl}${timezone}`)),
      map(timeObservable => timeObservable.pipe(
        map(timeData => ({ datetime: timeData.datetime, timezone: timeData.timezone }))
      ))
    );
  }
} 