import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data?.['preload'] && route.path) {
      // Add the route path to the preloaded modules array
      this.preloadedModules.push(route.path);
      
      // Log which routes are being preloaded
      console.log('Preloaded:', route.path);
      
      return load();
    } else {
      return of(null);
    }
  }
} 