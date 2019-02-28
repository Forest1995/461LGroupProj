import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HotelsNearSilvertonPage } from '../hotels-near-silverton/hotels-near-silverton';
import { FlightsPage } from '../flights/flights';
import { ConfirmPage } from '../confirm/confirm';

@Component({
  selector: 'page-resorts',
  templateUrl: 'resorts.html'
})
export class ResortsPage {

  constructor(public navCtrl: NavController) {
  }
  goToHotelsNearSilverton(params){
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
