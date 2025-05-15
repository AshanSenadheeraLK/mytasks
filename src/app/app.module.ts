import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AppComponent,
    RouterModule.forRoot([]),
    RecaptchaV3Module
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6Le9bDsrAAAAAM8A_mgmxg4aILmM9nmQBDelD2rz" }
  ]
})
export class AppModule { } 