import {HotelsNearSilvertonPage} from "./hotels-near-silverton";
import { NavController,NavParams } from 'ionic-angular';

describe(' hotel 组件', () => {
  let component;
  let navCtrl :  NavController;
  let navparams :NavParams;
  beforeEach(() => {
    component = new HotelsNearSilvertonPage(navCtrl, navparams);
  });

  it("Is created", function() {
    expect(component).toBeTruthy();
  });
  it("test hotel content", function() {
    component.refreshData();
    expect(component.stateDB).toContain("CO");
    expect(component.hotels).toContain("ahotelname");
  });
})
