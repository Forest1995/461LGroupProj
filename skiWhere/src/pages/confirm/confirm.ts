import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ServerRequest } from '../../request/api';

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmPage {
  api: ServerRequest;
  startDate : string;
  endDate : string;
  state: string;
  resort: any;
  hotel:any;
  flight:any;
  checkDate:boolean=false;
  checkResort:boolean=false;
  checkHotel:boolean=false;
  checkFlight:boolean=false;
  constructor(public navCtrl: NavController,public navParams: NavParams) {
    this.api = ServerRequest.Instance();
    this.startDate = navParams.get('start');
    this.endDate = navParams.get('end');
    this.state = navParams.get('state');
    this.resort = navParams.get('resort');
    this.hotel = navParams.get('hotel');
    this.flight = navParams.get('flight');
    console.log(this.startDate);
    console.log(this.endDate);
  }
  saveData(){
    if(this.checkDate && this.checkResort && this.checkHotel && this.checkFlight){
      this.api.postTrip(JSON.stringify({
        start : this.startDate,
        end: this.endDate,
        state:this.state,
        hotel:this.hotel,
        resort:this.resort,
        flight:this.flight
      }))
    }
    else{
      alert("Please confirm each selection")
    }
  }
}
