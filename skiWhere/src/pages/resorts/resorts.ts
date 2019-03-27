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
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    this.passOn=navParams;
    this.api = ServerRequest.Instance();
    this.data = navParams.get('data');
    console.log(this.data);
    //this.startDate= navParams.get('start');
    //this.endDate= navParams.get('end');
    //this.item = navParams.get('item');
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
    console.log(this.data);
    this.navCtrl.push(HotelsNearSilvertonPage,{data:this.data});
  }
}
