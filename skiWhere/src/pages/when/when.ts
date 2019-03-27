import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ResortsPage } from '../resorts/resorts';


@Component({
  selector: 'page-when',
  templateUrl: 'when.html'
})
export class WhenPage {

  public startDate:Date;
  public endDate:Date;

  constructor( public navCtrl: NavController){
    // userParams is an object we have in our nav-parameters

  }
  goToResorts(startDate,endDate){
    console.log(this.startDate);
    console.log(this.endDate);
    this.navCtrl.push(ResortsPage,{
      start : startDate,
      end: endDate
    });
  }
}
