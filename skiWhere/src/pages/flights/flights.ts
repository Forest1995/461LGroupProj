import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfirmPage } from '../confirm/confirm';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-flights',
  templateUrl: 'flights.html'
})
export class FlightsPage {

  constructor(public navCtrl: NavController, private http: HttpClient) {
  }
  load(){
    console.log(this.http.get('https://randomuser.me/api/?results=10'));
  }
  goToConfirm(params){
    if (!params) params = {};
    this.navCtrl.push(ConfirmPage);
  }
}
