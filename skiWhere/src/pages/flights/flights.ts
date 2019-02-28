import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfirmPage } from '../confirm/confirm';

@Component({
  selector: 'page-flights',
  templateUrl: 'flights.html'
})
export class FlightsPage {

  constructor(public navCtrl: NavController) {
  }
  goToConfirm(params){
    if (!params) params = {};
    this.navCtrl.push(ConfirmPage);
  }
}
