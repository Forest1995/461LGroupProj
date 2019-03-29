import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ServerRequest } from '../../request/api';

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmPage {
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
}
