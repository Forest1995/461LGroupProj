import { Component } from '@angular/core';
import { NavController ,NavParams, IonicPage} from 'ionic-angular';
import { HotelsNearSilvertonPage } from '../hotels-near-silverton/hotels-near-silverton';
import { ServerRequest } from '../../request/api'


@Component({
  selector: 'page-resorts',
  templateUrl: 'resorts.html'
})
export class ResortsPage {
  api: ServerRequest;
  data:any;
  startDate : string;
  endDate : string;
  item :string;
  public passOn: NavParams;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.passOn=navParams;
    this.api = ServerRequest.Instance();
    this.data = navParams.get('data');
    console.log(this.data);
    //this.startDate= navParams.get('start');
    //this.endDate= navParams.get('end');
    //this.item = navParams.get('item');
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
  load() {
    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get('https://randomuser.me/api/?results=10')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          console.log(this.data);
          resolve(this.data);

        });
    });
  }

  goToHotelsNearSilverton(){
    console.log(this.data);
    this.navCtrl.push(HotelsNearSilvertonPage,{data:this.data});
  }
}
