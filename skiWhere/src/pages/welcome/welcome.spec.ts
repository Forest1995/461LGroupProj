import {WelcomePage} from "./welcome";
import { NavController } from 'ionic-angular';
import { LoadingController} from 'ionic-angular';
import { Http } from '@angular/http';

describe(' Welcome 组件', () => {
  let component;
  let navCtrl :  NavController;
  let http:Http;
  let loadingCtrl: LoadingController;
  beforeEach(() => {
    component = new WelcomePage(navCtrl, http,loadingCtrl);
  });

  it("Is created", function() {
    expect(component).toBeTruthy();
  });
})
