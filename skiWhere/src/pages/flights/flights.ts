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
  dest_static:string = "To";
  origin_static:string = "From";
  api: ServerRequest;
  startDate : string;
  endDate : string;
  state: string;
  resort: any;
  hotel:any;
  constructor(public navCtrl: NavController,public navParams: NavParams) {
    this.api = ServerRequest.Instance();
    this.startDate = navParams.get('start');
    this.endDate = navParams.get('end');
    this.state = navParams.get('state');
    this.resort = navParams.get('resort');
    this.hotel = navParams.get('hotel');
    console.log(this.startDate);
    console.log(this.endDate);
  }
  refreshFlights(){
    this.dest_static = this.dest.toUpperCase();
    this.origin_static = this.origin.toUpperCase();
    //make this dynamic
    this.api.postFlights(this.startDate,this.endDate,this.origin.toUpperCase(),this.dest.toUpperCase()).then((resData)=>{
      this.flights = new Array<any>();
      for(let x of resData){
        x.origin=this.origin.toUpperCase()
        x.dest = this.dest.toUpperCase()
        //2019-06-01T21:19:00
        var dateLeave1 = x.leave_time1.substring(0,11);
        var dateArrive1 = x.arrive_time1.substring(0,11);
        x.leave_time1 = x.leave_time1.substring(11);
        x.arrive_time1 = x.arrive_time1.substring(11);
        if (dateLeave1 != dateArrive1){
          x.arrive_time1 = "+" + x.arrive_time1;
        }
        var dateLeave2 = x.leave_time2.substring(0,11);
        var dateArrive2 = x.arrive_time2.substring(0,11);
        x.leave_time2 = x.leave_time2.substring(11);
        x.arrive_time2 = x.arrive_time2.substring(11);
        if (dateLeave2 != dateArrive2){
          x.arrive_time2 = "+" + x.arrive_time2;
        }


        //do processing?? i.e. compute travel time
        this.flights.push(x);

      }
      /*this.flights.push({
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
      });*/

      //append flights to list
    });

  }
  ionViewWillEnter(){
    //this.refreshFlights("M-D-YYYY","M-D-YYYY","AUS","EWR");
  }
  goToConfirm(flight){
    this.navCtrl.push(ConfirmPage,{
      start : this.startDate,
      end: this.endDate,
      state:this.state,
      hotel:this.hotel,
      resort:this.resort,
      flight
    });
  }
}
