import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ResortsPage } from '../resorts/resorts';

@Component({
  selector: 'page-when',
  templateUrl: 'when.html'
})
export class WhenPage {

  public startDate:string;
  public endDate:string;
  constructor( public navCtrl: NavController){}


  goToResorts(){
    var curdate= new Date();
    var start=new Date(this.startDate);
    if(curdate.getTime>start.getTime){
      console.log(this.startDate);
      console.log(this.endDate);
      this.navCtrl.push(ResortsPage,{
        start : this.startDate,
        end: this.endDate,
      });
      
    }else{
      alert("Please choose a day after today!");
    }

  }
}
