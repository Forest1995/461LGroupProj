import {ConfirmPage} from "./confirm";
import { NavController,NavParams } from 'ionic-angular';

describe(' confirm 组件', () => {
  let component;
  let navCtrl :  NavController;
  let navparams :NavParams;
  beforeEach(() => {
    component = new ConfirmPage(navCtrl, navparams);
  });

  it("Is created", function() {
    expect(component).toBeTruthy();
  });
  it("test flights content", function() {
    expect(component.flight).toEqual("airlinename");
    expect(component.hotel).toEqual("hotelname");
    expect(component.checkDate).toEqual(false);
  });
})
