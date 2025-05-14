import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppComponent,
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AppComponent }
    ])
  ]
})
export class AppModule { } 