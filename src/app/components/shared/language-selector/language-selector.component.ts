import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService, Language } from '../../../services/language.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="language-selector">
      <div class="dropdown">
        <button 
          class="btn neo-btn-sm dropdown-toggle language-btn" 
          type="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
          title="Select your preferred language">
          <i class="bi bi-globe me-1"></i>
          {{ currentLanguage === 'en' ? 'English' : 'සිංහල' }}
        </button>
        <ul class="dropdown-menu neo-dropdown">
          <li>
            <button 
              class="dropdown-item" 
              [class.active]="currentLanguage === 'en'"
              (click)="changeLanguage('en')"
              title="Switch to English">
              <span class="me-2">🇺🇸</span> English
            </button>
          </li>
          <li>
            <button 
              class="dropdown-item" 
              [class.active]="currentLanguage === 'si'"
              (click)="changeLanguage('si')"
              title="Switch to Sinhala">
              <span class="me-2">🇱🇰</span> සිංහල
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .language-btn {
      background: transparent;
      border: 1px solid var(--neon-blue);
      color: var(--neon-blue);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }
    
    .language-btn:hover {
      background: rgba(0, 242, 254, 0.1);
      box-shadow: 0 0 8px rgba(0, 242, 254, 0.5);
    }
    
    .neo-dropdown {
      background: var(--card-bg);
      border: 1px solid var(--neon-blue);
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.2);
      border-radius: 4px;
      padding: 0.25rem;
      min-width: 8rem;
    }
    
    .dropdown-item {
      color: var(--text-primary);
      border-radius: 3px;
      padding: 0.5rem 1rem;
      transition: all 0.2s ease;
    }
    
    .dropdown-item:hover {
      background: rgba(0, 242, 254, 0.1);
      color: var(--neon-blue);
    }
    
    .dropdown-item.active {
      background: var(--neon-blue);
      color: var(--text-dark);
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  currentLanguage: Language = 'en';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(language => {
      this.currentLanguage = language;
    });
  }

  changeLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }
} 