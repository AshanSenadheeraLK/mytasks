import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha-19';

@NgModule({
  imports: [
    CommonModule,
    RecaptchaV3Module
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6Le9bDsrAAAAAM8A_mgmxg4aILmM9nmQBDelD2rz" }
  ],
  exports: [
    RecaptchaV3Module
  ]
})
export class AppModule { } 