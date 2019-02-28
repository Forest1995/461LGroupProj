import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerRequest } from '../../request/api'

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  users:Array<User> = new Array<User>();
  api: ServerRequest;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.api = ServerRequest.Instance();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
    this.api.getGitStats().then((data:any)=>{
      for(let u of data){
        let x = new User(u["author"]["login"],u["author"]["avatar_url"],u["total"])
        this.users.push(x);
        console.log(JSON.stringify(x));
      }
    })
  }

}
class User {
  constructor(public name:String, public avatar:String, public count:number){}
}
