import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HotelsNearSilvertonPage } from '../hotels-near-silverton/hotels-near-silverton';
import { FlightsPage } from '../flights/flights';
import { ConfirmPage } from '../confirm/confirm';
import { ServerRequest } from '../../request/api'

@Component({
  selector: 'page-resorts',
  templateUrl: 'resorts.html'
})
export class ResortsPage {
  api: ServerRequest;

  constructor(public navCtrl: NavController) {
    this.api = ServerRequest.Instance();
  }
  ionViewWillEnter(){
    //get date from previous page
    //use default state and price
    this.api.postResort("3/11/2019","3/22/2019","TX",1).then((res)=>{
      //update ui
    })
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
