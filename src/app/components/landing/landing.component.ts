import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../services/device.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent, ThemeToggleComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-background dark:bg-background-dark relative overflow-hidden">
      <!-- Background shapes -->
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 dark:bg-primary-light/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-base-green/5 dark:bg-base-green/5 rounded-full blur-3xl"></div>
  
      <!-- Navbar - Full Width -->
      <nav class="fixed top-0 left-0 right-0 z-[var(--z-sticky)] bg-white/90 dark:bg-background-dark/90 backdrop-blur-md shadow-sm">
        <div class="w-full px-6 md:px-8 lg:px-12 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary dark:bg-primary-light rounded-lg flex items-center justify-center">
              <i class="bi bi-check2-all text-white dark:text-gray-900 text-xl"></i>
            </div>
            <h1 class="text-xl font-display font-bold text-primary dark:text-primary-light">MYTASKS</h1>
          </div>
          <div class="flex items-center space-x-6">
            <a href="#features" class="nav-link hidden md:block">Features</a>
            <a href="#about" class="nav-link hidden md:block">About</a>
            <a href="#contact" class="nav-link hidden md:block">Contact</a>
            <app-theme-toggle></app-theme-toggle>
            <a routerLink="/login" class="btn btn-outline">Login</a>
            <a routerLink="/register" class="btn btn-primary">Register</a>
          </div>
        </div>
      </nav>

      <!-- Hero - Full Screen -->
      <section class="flex-1 flex items-center pt-24 pb-16 relative z-10 min-h-[calc(100vh-64px)]">
        <div class="w-full px-6 md:px-8 lg:px-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 class="text-4xl md:text-5xl font-bold font-display text-gray-800 dark:text-white leading-tight mb-6">
                Streamline Your Workflow<br>
                <span class="text-primary dark:text-primary-light">with MyTasks</span>
              </h1>
              <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                Manage projects effortlessly with an interface crafted for clarity.
                Focus on what matters and achieve more every single day.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 mb-8">
                <a routerLink="/register" class="btn btn-primary btn-lg">
                  Get Started For Free
                </a>
                <a routerLink="/login" class="btn btn-outline btn-lg">
                  <i class="bi bi-person-circle mr-2"></i> Login
                </a>
              </div>
              
              <div class="flex flex-wrap gap-4 md:gap-8 text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <i class="bi bi-people-fill mr-2 text-primary dark:text-primary-light"></i>
                  <span>12,000+ users</span>
                </div>
                <div class="flex items-center">
                  <i class="bi bi-star-fill mr-2 text-base-yellow dark:text-status-warningDark"></i>
                  <span>4.9/5 rating</span>
                </div>
                <div class="flex items-center">
                  <i class="bi bi-shield-lock mr-2 text-base-green dark:text-status-successDark"></i>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
            
            <!-- App preview -->
            <div class="relative hidden lg:block">
              <div class="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-light/5 dark:from-primary-light/10 dark:to-primary/5 rounded-3xl blur-lg transform -rotate-1"></div>
              <div class="card p-8 shadow-lg dark:shadow-gray-900/20 relative backdrop-blur-sm z-10">
                <div class="flex justify-between items-center mb-8">
                  <div>
                    <h2 class="font-bold text-gray-800 dark:text-white text-xl mb-1">My Dashboard</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Welcome back, Alex</p>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <i class="bi bi-person text-gray-500 dark:text-gray-400"></i>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-6">
                  <div class="p-3 rounded-lg bg-primary/10 dark:bg-primary-light/10">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Total Tasks</div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-white">24</div>
                  </div>
                  <div class="p-3 rounded-lg bg-base-green/10 dark:bg-status-successDark/10">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-white">16</div>
                  </div>
                  <div class="p-3 rounded-lg bg-base-yellow/10 dark:bg-status-warningDark/10">
                    <div class="text-xs text-gray-600 dark:text-gray-400">Upcoming</div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-white">8</div>
                  </div>
                </div>
                
                <h3 class="font-medium text-gray-800 dark:text-white mb-3">Today's Tasks</h3>
                <ul class="space-y-3 mb-6">
                  <li class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span class="w-5 h-5 rounded flex items-center justify-center bg-primary/10 dark:bg-primary-light/20 text-primary dark:text-primary-light mr-3">
                      <i class="bi bi-check"></i>
                    </span>
                    <div class="flex-1">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-800 dark:text-gray-200 font-medium">Team meeting</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">9:00 AM</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Project kickoff discussion</p>
                    </div>
                  </li>
                  <li class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span class="w-5 h-5 rounded flex items-center justify-center bg-primary/10 dark:bg-primary-light/20 text-primary dark:text-primary-light mr-3">
                      <i class="bi bi-check"></i>
                    </span>
                    <div class="flex-1">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-800 dark:text-gray-200 font-medium">Review designs</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">11:30 AM</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Feedback on new UI components</p>
                    </div>
                  </li>
                  <li class="flex items-center p-3 rounded-lg">
                    <span class="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 mr-3"></span>
                    <div class="flex-1">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-800 dark:text-gray-200 font-medium">Write documentation</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">2:00 PM</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">API documentation update</p>
                    </div>
                  </li>
                </ul>
                
                <button class="w-full py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center">
                  <i class="bi bi-plus mr-2"></i> Add New Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section id="features" class="py-16 relative z-10 bg-background-secondary dark:bg-background-secondary-dark">
        <div class="w-full px-6 md:px-8 lg:px-12">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Powerful Features</h2>
            <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Everything you need to stay organized and productive</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="card p-6 card-hover">
              <i class="bi bi-lightning-charge text-base-yellow dark:text-status-warningDark text-3xl mb-4"></i>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Lightning Fast</h3>
              <p class="text-gray-600 dark:text-gray-400">Optimized performance for seamless task management on any device.</p>
            </div>
            <div class="card p-6 card-hover">
              <i class="bi bi-shield-check text-base-green dark:text-status-successDark text-3xl mb-4"></i>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Secure & Private</h3>
              <p class="text-gray-600 dark:text-gray-400">Your data is encrypted and protected with industry-leading security.</p>
            </div>
            <div class="card p-6 card-hover">
              <i class="bi bi-graph-up-arrow text-base-red dark:text-status-errorDark text-3xl mb-4"></i>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Insightful Analytics</h3>
              <p class="text-gray-600 dark:text-gray-400">Track progress and visualize productivity trends over time.</p>
            </div>
            <div class="card p-6 card-hover">
              <i class="bi bi-bell text-primary dark:text-primary-light text-3xl mb-4"></i>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Smart Reminders</h3>
              <p class="text-gray-600 dark:text-gray-400">Get timely notifications to stay on top of your tasks and deadlines.</p>
            </div>
            <div class="card p-6 card-hover">
              <i class="bi bi-calendar-week text-primary dark:text-primary-light text-3xl mb-4"></i>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Calendar Integration</h3>
              <p class="text-gray-600 dark:text-gray-400">Seamlessly sync with your favorite calendar applications.</p>
            </div>
            <div class="card p-6 card-hover">
              <i class="bi bi-palette text-base-green dark:text-status-successDark text-3xl mb-4"></i>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Customizable</h3>
              <p class="text-gray-600 dark:text-gray-400">Personalize your experience with themes and layout options.</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- About Section -->
      <section id="about" class="py-16 relative z-10">
        <div class="w-full px-6 md:px-8 lg:px-12">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">About MyTasks</h2>
            <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Designed to help you achieve more with less effort</p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                MyTasks was created with a simple mission: to help people organize their work and life more effectively. 
                Our platform combines powerful task management features with an intuitive, beautiful interface.
              </p>
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Whether you're a busy professional, a student, or someone who just wants to stay organized, 
                MyTasks adapts to your needs with customizable workflows and intelligent productivity tools.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a href="#features" class="btn btn-primary">Explore Features</a>
                <a routerLink="/register" class="btn btn-outline">Get Started</a>
              </div>
            </div>
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-base-green/10 to-primary/5 dark:from-status-successDark/10 dark:to-primary-light/5 rounded-3xl blur-lg transform rotate-1"></div>
              <img src="assets/images/about-illustration.svg" alt="Task management illustration" class="relative z-10 w-full h-auto">
            </div>
          </div>
        </div>
      </section>
      
      <!-- Contact Section -->
      <section id="contact" class="py-16 relative z-10 bg-background-secondary dark:bg-background-secondary-dark">
        <div class="w-full px-6 md:px-8 lg:px-12">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Contact Us</h2>
            <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Have questions or feedback? We'd love to hear from you.</p>
          </div>
          
          <div class="max-w-3xl mx-auto">
            <div class="card p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Get in Touch</h3>
                  <div class="space-y-4">
                    <div class="flex items-start">
                      <i class="bi bi-envelope text-primary dark:text-primary-light mt-1 mr-3 text-xl"></i>
                      <div>
                        <h4 class="text-base font-medium text-gray-800 dark:text-white">Email</h4>
                        <p class="text-gray-600 dark:text-gray-400">support&#64;mytasks.com</p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <i class="bi bi-geo-alt text-primary dark:text-primary-light mt-1 mr-3 text-xl"></i>
                      <div>
                        <h4 class="text-base font-medium text-gray-800 dark:text-white">Location</h4>
                        <p class="text-gray-600 dark:text-gray-400">123 Task Street, Productivity City</p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <i class="bi bi-clock text-primary dark:text-primary-light mt-1 mr-3 text-xl"></i>
                      <div>
                        <h4 class="text-base font-medium text-gray-800 dark:text-white">Support Hours</h4>
                        <p class="text-gray-600 dark:text-gray-400">Monday - Friday, 9am - 5pm EST</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Follow Us</h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">Stay updated with our latest features and announcements.</p>
                  <div class="flex gap-4">
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-gray-900 transition-colors">
                      <i class="bi bi-twitter"></i>
                    </a>
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-gray-900 transition-colors">
                      <i class="bi bi-facebook"></i>
                    </a>
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-gray-900 transition-colors">
                      <i class="bi bi-instagram"></i>
                    </a>
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-gray-900 transition-colors">
                      <i class="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Footer - Full Width -->
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .nav-link {
      @apply text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors;
    }
    
    .card {
      @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/10 border border-gray-200 dark:border-gray-700;
    }
    
    .card-hover {
      @apply hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-300 hover:-translate-y-1;
    }
    
    .btn {
      @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-background-dark;
    }
    
    .btn-primary {
      @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary dark:hover:text-white dark:focus:ring-primary-light;
    }
    
    .btn-outline {
      @apply border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600;
    }
    
    .btn-lg {
      @apply px-6 py-3 text-lg;
    }
  `]
})
export class LandingComponent {
  constructor(private deviceService: DeviceService) { }
} 