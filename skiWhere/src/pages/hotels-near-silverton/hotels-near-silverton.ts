import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { FlightsPage } from '../flights/flights';
import { ServerRequest } from '../../request/api';

@Component({
  selector: 'page-hotels-near-silverton',
  templateUrl: 'hotels-near-silverton.html'
})
export class HotelsNearSilvertonPage {
  hotels : Array<any> = new Array<any>();
  api: ServerRequest;
  startDate : string;
  endDate : string;
  state: string;
  resort: any;
  priceDirection :String;
  stateDB ={
    "CO":"Denver, Colorado",
    "NH":"Concord, New Hampshire",
    "CA":"Sacramento, California",
    "MI":"Lansing ,Michigan",
    "WI":"Madison, Wisconsin",
    "NY":"Albany, New York",
    "PA":"Scranton, Pennsylvania",
    "ME":"Augusta, Maine",
    "WA":"Olympia, Washington",
    "NC":"Raleigh, North Carolina",
    "MN":"Saint Paul, Minnesota"
}
  constructor(public navCtrl: NavController,public navParams: NavParams) {
    this.api = ServerRequest.Instance();
    this.priceDirection = "0";
    this.startDate = navParams.get('start');
    this.endDate = navParams.get('end');
    this.state = navParams.get('state');
    this.resort = navParams.get('resort');
  }
  refreshData(){
    this.hotels=new Array<any>();
    this.api.postHotels(this.startDate,this.endDate,this.stateDB[this.state],parseInt(""+this.priceDirection)).then((resData)=>{
      for(let x of resData){
        
        this.hotels.push(x);
      }
    })
  }
  ionViewWillEnter(){
    this.refreshData();

  }
  goToFlights(hotel){
    this.navCtrl.push(FlightsPage,{
      start : this.startDate,
      end: this.endDate,
      state:this.state,
      hotel,
      resort:this.resort
    });
  }
}
