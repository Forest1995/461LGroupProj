import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ConfirmPage } from '../confirm/confirm';
import { ServerRequest } from '../../request/api';

@Component({
  selector: 'page-flights',
  templateUrl: 'flights.html'
})
export class FlightsPage {
  flights : Array<any> = new Array<any>();
  dest:string;
  origin:string;
  api: ServerRequest;
  startDate : string;
  endDate : string;
  constructor(public navCtrl: NavController,public navParams: NavParams) {
    this.api = ServerRequest.Instance();
    this.startDate = navParams.get('start');
    this.endDate = navParams.get('end');
    console.log(this.startDate);
    console.log(this.endDate);
  }
  refreshFlights(){
    //make this dynamic
    this.api.postFlights(this.startDate,this.endDate,this.origin,this.dest).then((resData)=>{
      this.flights = new Array<any>();
      for(let x of resData){
        //do processing?? i.e. compute travel time
        this.flights.push(x);
      }
      this.flights.push({
        leave_time1:"4:30p",
        arrive_time1:"6:30p",
        leave_time2:"4:30p",
        arrive_time2:"6:30p",
        airline:"United",
        price:100,
        flightNo:"256"
      });
      this.flights.push({
        leave_time1:"4:30p",
        arrive_time1:"6:30p",
        leave_time2:"4:30p",
        arrive_time2:"6:30p",
        airline:"Alaska",
        price:100,
        flightNo:"256"
      });

      //append flights to list
    });

  }
  ionViewWillEnter(){
    this.refreshFlights("M-D-YYYY","M-D-YYYY","AUS","EWR");
  }
  goToConfirm(){
    this.navCtrl.push(ConfirmPage,{
      start : this.startDate,
      end: this.endDate,
    });
  }
}
