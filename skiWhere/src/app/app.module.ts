import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { WhenPage } from '../pages/when/when';
import { ResortsPage } from '../pages/resorts/resorts';
import { HotelsNearSilvertonPage } from '../pages/hotels-near-silverton/hotels-near-silverton';
import { FlightsPage } from '../pages/flights/flights';
import { ConfirmPage } from '../pages/confirm/confirm';
import { HttpModule } from '@angular/http';
import { AboutPage } from '../pages/about/about';
import { CalendarModule } from "ion2-calendar";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    WhenPage,
    ResortsPage,
    HotelsNearSilvertonPage,
    FlightsPage,
    ConfirmPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    CalendarModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    WhenPage,
    ResortsPage,
    HotelsNearSilvertonPage,
    FlightsPage,
    ConfirmPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
