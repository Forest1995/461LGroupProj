import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FlightsPage } from '../flights/flights';
import { ConfirmPage } from '../confirm/confirm';

@Component({
  selector: 'page-hotels-near-silverton',
  templateUrl: 'hotels-near-silverton.html'
})
export class HotelsNearSilvertonPage {

  constructor(public navCtrl: NavController) {
  }
  goToFlights(params){
    if (!params) params = {};
    this.navCtrl.push(FlightsPage);
  }goToConfirm(params){
    if (!params) params = {};
    this.navCtrl.push(ConfirmPage);
  }
}
