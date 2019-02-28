import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ResortsPage } from '../resorts/resorts';
import { HotelsNearSilvertonPage } from '../hotels-near-silverton/hotels-near-silverton';
import { FlightsPage } from '../flights/flights';
import { ConfirmPage } from '../confirm/confirm';

@Component({
  selector: 'page-when',
  templateUrl: 'when.html'
})
export class WhenPage {

  constructor(public navCtrl: NavController) {
  }
  goToResorts(params){
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
}
