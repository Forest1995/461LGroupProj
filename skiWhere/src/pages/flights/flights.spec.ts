import {FlightsPage} from "./flights";
import { NavController,NavParams } from 'ionic-angular';

describe(' filghts 组件', () => {
  let component;
  let navCtrl :  NavController;
  let navparams :NavParams;
  beforeEach(() => {
    component = new FlightsPage(navCtrl, navparams);
  });

  it("Is created", function() {
    expect(component).toBeTruthy();
  });
  it("test flights content", function() {
    component.refreshFlights();
    expect(component.flights.airline).toContain("airlinename");
    expect(component.origin).toEqual("AUS");
  });
})
