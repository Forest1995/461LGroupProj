import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FlightsPage } from '../flights/flights';
import { ConfirmPage } from '../confirm/confirm';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-hotels-near-silverton',
  templateUrl: 'hotels-near-silverton.html'
})
export class HotelsNearSilvertonPage {

  constructor(public navCtrl: NavController, private http: HttpClient) {
  }
  load(){
    console.log(this.http.get('https://randomuser.me/api/?results=10'));
  }
  goToFlights(params){
    if (!params) params = {};
    this.navCtrl.push(FlightsPage);
  }goToConfirm(params){
    if (!params) params = {};
    this.navCtrl.push(ConfirmPage);
  }
}
