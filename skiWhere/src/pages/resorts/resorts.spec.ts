import {ResortsPage} from "./resorts";
import { NavController ,NavParams} from 'ionic-angular';

describe(' Resort 组件', () => {
  let component;
  let navCtrl :  NavController;
  let navParams:NavParams;
  beforeEach(() => {
    component = new ResortsPage(navCtrl, navParams);
  });
  it("Is created", function() {
    expect(component).toBeTruthy();
  });
  it("test resort content", function() {
    component.refreshData();
    expect(component.state).toEqual("CO");
    expect(component.priceDirection.toEqual ("0"));
    expect(component.resorts.name).toContain("firstResortName");
  });
})
