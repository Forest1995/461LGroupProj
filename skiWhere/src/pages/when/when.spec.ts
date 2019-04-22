import {WhenPage} from "./when";
import { NavController ,NavParams} from 'ionic-angular';
import { ModalController } from 'ionic-angular';

describe(' When page', () => {
  let component;
  let navCtrl :  NavController;
  let navParams:NavParams;
  let modalcontroler :ModalController;
  beforeEach(() => {
    component = new WhenPage(navCtrl, navParams,modalcontroler);
  });
  it("Is created", function() {
    expect(component).toBeTruthy();
  });
  it("test 1 of when page", function() {
    expect(component.dateRange.from).toEqual("YYYY-MM-DD");
  });
})
