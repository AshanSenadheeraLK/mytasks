import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'si';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANGUAGE: Language = 'en';
  private languageSubject = new BehaviorSubject<Language>(this.DEFAULT_LANGUAGE);
  private isBrowser: boolean;
  
  // This will hold all translations
  private translations: { [key: string]: { [key: string]: string } } = {};

  // Observable for components to subscribe to
  currentLanguage$: Observable<Language> = this.languageSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initLanguage();
    this.loadTranslations();
  }

  private initLanguage(): void {
    if (!this.isBrowser) return;
    
    // Get stored language or use browser's language if first time
    const storedLanguage = localStorage.getItem(this.STORAGE_KEY);
    const browserLanguage = navigator.language.startsWith('si') ? 'si' : 'en';
    
    const language = (storedLanguage as Language) || browserLanguage;
    this.setLanguage(language);
  }

  // Change the current language
  setLanguage(language: Language): void {
    if (!this.isBrowser) return;
    
    this.languageSubject.next(language);
    localStorage.setItem(this.STORAGE_KEY, language);
    
    // Update document language attribute
    document.documentElement.lang = language;
    
    // Update font family based on selected language
    document.documentElement.classList.remove('lang-en', 'lang-si');
    document.documentElement.classList.add(`lang-${language}`);
  }

  // Get current language
  getCurrentLanguage(): Language {
    return this.languageSubject.value;
  }

  // Get translation for a key
  translate(key: string): string {
    const language = this.getCurrentLanguage();
    if (this.translations[language] && this.translations[language][key]) {
      return this.translations[language][key];
    }
    // Fallback to English
    if (language !== 'en' && this.translations['en'] && this.translations['en'][key]) {
      return this.translations['en'][key];
    }
    // Return the key itself if no translation found
    return key;
  }

  // Load all translations
  private loadTranslations(): void {
    // English translations
    this.translations['en'] = {
      // Common
      'app_title': 'MY TASKS',
      'app_subtitle': 'Task Manager',
      'app_tagline': 'Manage your tasks in a smart way!',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'warning': 'Warning',
      'info': 'Information',
      'close': 'Close',
      'save': 'Save',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'edit': 'Edit',
      'add': 'Add',
      
      // Auth
      'sign_in': 'Sign In',
      'sign_up': 'Sign Up',
      'sign_out': 'Sign Out',
      'email': 'Email',
      'password': 'Password',
      'enter_email': 'Your email',
      'enter_password': 'Your password',
      'create_account': 'Create Account',
      'email_required': 'Please enter your email',
      'valid_email_required': 'Please enter a valid email',
      'password_required': 'Please enter your password',
      'password_length': 'Password must be at least 6 characters',
      'login_error': 'Invalid email or password. Please try again.',
      'login_success': 'Signed in successfully. Welcome back!',
      'logout_success': 'You have been signed out successfully',
      
      // Todo List
      'my_tasks': 'MY TASKS',
      'task_manager': 'Task Manager',
      'task_summary': 'Task Summary',
      'done': 'DONE',
      'to_do': 'TO DO',
      'total': 'TOTAL',
      'view_options': 'View Options',
      'all_tasks': 'All Tasks',
      'pending_tasks': 'Pending Tasks',
      'completed_tasks': 'Completed Tasks',
      'add_task': 'Add Task',
      'add_new_task': 'Add New Task',
      'edit_task': 'Edit Task',
      'task_name': 'Task Name',
      'task_description': 'Task Description',
      'due_date': 'Due Date',
      'due_time': 'Due Time',
      'enter_task_name': 'Enter task name',
      'enter_task_details': 'Enter task details (optional)',
      'task_added': 'New task added successfully',
      'task_updated': 'Task updated successfully',
      'task_deleted': 'Task deleted successfully',
      'task_marked_pending': 'Task marked as pending',
      'task_marked_completed': 'Task marked as completed',
      'no_tasks': 'No Tasks Yet',
      'add_first_task': 'Click the Add Task button to get started.',
      'created': 'Created',
      'due': 'Due',
      'pending': 'PENDING',
      
      // Errors
      'save_error': 'Could not save task. Please try again.',
      'update_error': 'Could not update task. Please try again.',
      'delete_error': 'Could not delete task. Please try again.',
      'logout_error': 'Could not sign out. Please try again.',
      
      // Language
      'language': 'Language',
      'english': 'English',
      'sinhala': 'සිංහල',  // Keeping the language name in its native form
    };
    
    // Sinhala translations
    this.translations['si'] = {
      // Common
      'app_title': 'මගේ කාර්යයන්',
      'app_subtitle': 'කාර්ය කළමනාකරු',
      'app_tagline': 'ඔබේ කාර්යයන් බුද්ධිමත් ලෙස කළමනාකරණය කරන්න!',
      'loading': 'පූරණය වෙමින්...',
      'error': 'දෝෂයකි',
      'success': 'සාර්ථකයි',
      'warning': 'අවවාදයයි',
      'info': 'තොරතුරු',
      'close': 'වසන්න',
      'save': 'සුරකින්න',
      'cancel': 'අවලංගු කරන්න',
      'delete': 'මකන්න',
      'edit': 'සංස්කරණය කරන්න',
      'add': 'එකතු කරන්න',
      
      // Auth
      'sign_in': 'පිවිසෙන්න',
      'sign_up': 'ලියාපදිංචි වන්න',
      'sign_out': 'පිටවීම',
      'email': 'විද්‍යුත් තැපෑල',
      'password': 'මුරපදය',
      'enter_email': 'ඔබගේ විද්‍යුත් තැපෑල',
      'enter_password': 'ඔබගේ මුරපදය',
      'create_account': 'ගිණුමක් සාදන්න',
      'email_required': 'කරුණාකර ඔබගේ විද්‍යුත් තැපෑල ඇතුළත් කරන්න',
      'valid_email_required': 'කරුණාකර වලංගු විද්‍යුත් තැපෑලක් ඇතුළත් කරන්න',
      'password_required': 'කරුණාකර ඔබගේ මුරපදය ඇතුළත් කරන්න',
      'password_length': 'මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය',
      'login_error': 'අවලංගු විද්‍යුත් තැපෑල හෝ මුරපදය. කරුණාකර නැවත උත්සාහ කරන්න.',
      'login_success': 'සාර්ථකව පිවිසුණි. ආපසු සාදරයෙන් පිළිගනිමු!',
      'logout_success': 'ඔබ සාර්ථකව පිටවී ඇත',
      
      // Todo List
      'my_tasks': 'මගේ කාර්යයන්',
      'task_manager': 'කාර්ය කළමනාකරු',
      'task_summary': 'කාර්ය සාරාංශය',
      'done': 'නිම කළ',
      'to_do': 'කළ යුතු',
      'total': 'මුළු',
      'view_options': 'බැලීමේ විකල්ප',
      'all_tasks': 'සියලු කාර්යයන්',
      'pending_tasks': 'අපේක්ෂිත කාර්යයන්',
      'completed_tasks': 'සම්පූර්ණ කළ කාර්යයන්',
      'add_task': 'කාර්යය එකතු කරන්න',
      'add_new_task': 'නව කාර්යය එකතු කරන්න',
      'edit_task': 'කාර්යය සංස්කරණය කරන්න',
      'task_name': 'කාර්ය නාමය',
      'task_description': 'කාර්ය විස්තරය',
      'due_date': 'නියමිත දිනය',
      'due_time': 'නියමිත වේලාව',
      'enter_task_name': 'කාර්ය නාමය ඇතුළත් කරන්න',
      'enter_task_details': 'කාර්ය විස්තර ඇතුළත් කරන්න (විකල්පයි)',
      'task_added': 'නව කාර්යය සාර්ථකව එකතු කරන ලදී',
      'task_updated': 'කාර්යය සාර්ථකව යාවත්කාලීන කරන ලදී',
      'task_deleted': 'කාර්යය සාර්ථකව මකා දමන ලදී',
      'task_marked_pending': 'කාර්යය අපේක්ෂිත ලෙස ලකුණු කර ඇත',
      'task_marked_completed': 'කාර්යය සම්පූර්ණ කළ ලෙස ලකුණු කර ඇත',
      'no_tasks': 'තවම කාර්යයන් නොමැත',
      'add_first_task': 'කාර්යය එකතු කරන්න බොත්තම ක්ලික් කර ආරම්භ කරන්න.',
      'created': 'සාදන ලදී',
      'due': 'නියමිත',
      'pending': 'අපේක්ෂිත',
      
      // Errors
      'save_error': 'කාර්යය සුරැකීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
      'update_error': 'කාර්යය යාවත්කාලීන කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
      'delete_error': 'කාර්යය මැකීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
      'logout_error': 'පිටවීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
      
      // Language
      'language': 'භාෂාව',
      'english': 'English',
      'sinhala': 'සිංහල',
    };
  }
} 