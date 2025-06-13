import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha-19';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  imports: [
    CommonModule,
    RecaptchaV3Module,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6Le9bDsrAAAAAM8A_mgmxg4aILmM9nmQBDelD2rz" }
  ],
  exports: [
    RecaptchaV3Module,
    RouterModule
  ]
})
export class AppModule { } 