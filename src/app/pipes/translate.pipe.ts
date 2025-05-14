import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // This makes the pipe impure, so it will update when language changes
})
export class TranslatePipe implements PipeTransform {
  
  constructor(private languageService: LanguageService) {}
  
  transform(key: string): string {
    return this.languageService.translate(key);
  }
} 