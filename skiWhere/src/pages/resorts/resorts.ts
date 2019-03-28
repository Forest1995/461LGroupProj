import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { HotelsNearSilvertonPage } from '../hotels-near-silverton/hotels-near-silverton';
import { ServerRequest } from '../../request/api'
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-resorts',
  templateUrl: 'resorts.html'
})
export class ResortsPage {
  api: ServerRequest;
  startDate : string;
  endDate : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    this.api = ServerRequest.Instance();
    this.startDate = navParams.get('start');
    this.endDate = navParams.get('end');
    console.log(this.startDate);
    console.log(this.endDate);
  }
  load(){
    console.log(this.http.get('https://randomuser.me/api/?results=10'));
  }

  // ionViewWillEnter(params){

  //   //console.log(this.startDate);
  //   //console.log(this.endDate);
  //   //get date from previous page
  //   //use default state and price
  //   //this.api.postResort("3/11/2019","3/22/2019","TX",1).then((res)=>{
  //   //update ui
  //   // })
    // }


  goToHotelsNearSilverton(){
    this.navCtrl.push(HotelsNearSilvertonPage,{
      start : this.startDate,
      end: this.endDate,
    });
  }
}
