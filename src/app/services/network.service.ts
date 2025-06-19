import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private online$ = new BehaviorSubject<boolean>(navigator.onLine);
  
  constructor() {
    // Listen for online/offline events
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(isOnline => {
      this.online$.next(isOnline);
      
      if (isOnline) {
        this.handleReconnection();
      }
    });
  }
  
  /**
   * Get an observable that emits the current online status
   */
  get isOnline$(): Observable<boolean> {
    return this.online$.asObservable();
  }
  
  /**
   * Get the current online status
   */
  get isOnline(): boolean {
    return this.online$.getValue();
  }
  
  /**
   * Handle reconnection logic when coming back online
   */
  private handleReconnection(): void {
    // Sync any pending data that was stored while offline
    this.syncPendingData();
    
    // Notify services that need to refresh data
    this.notifyReconnection();
  }
  
  /**
   * Sync any data that was stored locally while offline
   */
  private syncPendingData(): void {
    try {
      const pendingRequests = localStorage.getItem('pendingRequests');
      if (pendingRequests) {
        const requests = JSON.parse(pendingRequests);
        // Process pending requests - implementation depends on your app's needs
        
        // Clear pending requests after processing
        localStorage.removeItem('pendingRequests');
      }
    } catch (err) {
      console.error('Error syncing pending data:', err);
    }
  }
  
  /**
   * Notify services that need to refresh their data
   */
  private notifyReconnection(): void {
    // This could dispatch an event or call specific services
    // that need to refresh their data
    console.log('Network reconnected, refreshing data...');
    
    // Example: dispatch a custom event
    const reconnectEvent = new CustomEvent('app:network:reconnected');
    window.dispatchEvent(reconnectEvent);
  }
  
  /**
   * Store a request to be processed when back online
   */
  storePendingRequest(request: any): void {
    try {
      const pendingRequests = localStorage.getItem('pendingRequests') || '[]';
      const requests = JSON.parse(pendingRequests);
      requests.push(request);
      localStorage.setItem('pendingRequests', JSON.stringify(requests));
    } catch (err) {
      console.error('Error storing pending request:', err);
    }
  }
} 