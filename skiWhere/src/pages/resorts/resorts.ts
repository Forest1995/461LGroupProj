import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { HotelsNearSilvertonPage } from '../hotels-near-silverton/hotels-near-silverton';
import { ServerRequest } from '../../request/api'


@Component({
  selector: 'page-resorts',
  templateUrl: 'resorts.html'
})
export class ResortsPage {
  public searchTerm: string = "";
  api: ServerRequest;
  startDate : string;
  endDate : string;
  base_resorts:Array<any> = new Array<any>();
  resorts:Array<any> = new Array<any>();
  priceDirection :String;
  state :string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.state= "CO";
    this.priceDirection = "0";
    this.api = ServerRequest.Instance();
    this.startDate = navParams.get('start');
    this.endDate = navParams.get('end');
  }
  setFilteredItems() {
    this.resorts = this.base_resorts.filter(item => {
      return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
  refreshData(){
    this.base_resorts=new Array<any>();
    this.resorts=new Array<any>();
    this.api.postResort("3/11/2019","3/22/2019",this.state,parseInt(""+this.priceDirection)).then((resData)=>{
      for(let x of resData){
        let resort = x ;
        this.base_resorts.push(resort);
        this.resorts.push(resort);
      }
    })
  }

  ionViewWillEnter(){
    this.refreshData();

  }
    //get date from previous page
    //use default state and price
    


  goToHotelsNearSilverton(resort){
    this.navCtrl.push(HotelsNearSilvertonPage,{
      start : this.startDate,
      end: this.endDate,
      resort
    });
  }
}