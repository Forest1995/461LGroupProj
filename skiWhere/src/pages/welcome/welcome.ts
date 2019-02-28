import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WhenPage } from '../when/when';
import { ResortsPage } from '../resorts/resorts';
import { HotelsNearSilvertonPage } from '../hotels-near-silverton/hotels-near-silverton';
import { FlightsPage } from '../flights/flights';
import { ConfirmPage } from '../confirm/confirm';
import { AboutPage } from '../about/about';

import { Http } from '@angular/http';
import { ServerRequest } from '../../request/api';
import { LoadingController} from 'ionic-angular';



@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  api: ServerRequest;
  constructor(public navCtrl: NavController,public http: Http, public loadingCtrl: LoadingController) {
    this.api = ServerRequest.Instance(http, loadingCtrl);

  }
  goToWhen(params){
    if (!params) params = {};
    this.navCtrl.push(WhenPage);
  }goToResorts(params){
    if (!params) params = {};
    this.navCtrl.push(ResortsPage);
  }goToHotelsNearSilverton(params){
    if (!params) params = {};
    this.navCtrl.push(HotelsNearSilvertonPage);
  }goToFlights(params){
    if (!params) params = {};
    this.navCtrl.push(FlightsPage);
  }goToConfirm(params){
    if (!params) params = {};
    this.navCtrl.push(ConfirmPage);
  }
  goToAbout(params){
    if (!params) params = {};
    this.navCtrl.push(AboutPage);
  }
}
