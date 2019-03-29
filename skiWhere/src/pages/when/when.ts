import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ResortsPage } from '../resorts/resorts';
import { FlightsPage } from '../flights/flights';

@Component({
  selector: 'page-when',
  templateUrl: 'when.html'
})
export class WhenPage {

  public startDate:string;
  public endDate:string;
  constructor( public navCtrl: NavController){}


  goToResorts(){
    console.log(this.startDate);
    console.log(this.endDate);
    this.navCtrl.push(FlightsPage,{
      start : this.startDate,
      end: this.endDate,
    });
  }
}
