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
  constructor(public navCtrl: NavController,public navParams: NavParams) {
    this.api = ServerRequest.Instance();
    this.startDate = navParams.get('start');
    this.endDate = navParams.get('end');
    this.state = navParams.get('state');
    this.resort = navParams.get('resort');
    console.log(this.startDate);
    console.log(this.endDate);
  }
  refreshData(){
    this.hotels=new Array<any>();
    this.api.postHotels(this.startDate,this.endDate,this.state).then((resData)=>{
      for(let x of resData){

        this.hotels.push(x);
      }
      this.hotels.push({name:"hi",price:10,address:"hiii",rating:3.4});
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
