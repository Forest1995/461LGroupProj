import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerRequest } from '../../request/api'
import { team } from './bio'
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
  total_commits:number=0;
  total_issues:number=0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.api = ServerRequest.Instance();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
    this.api.getGitStats().then((data:any)=>{
      for(let u of data){
        this.total_commits+=u["total"];
        let uname = u["author"]["login"].toLowerCase();
        let x = new User(uname,u["author"]["avatar_url"],u["total"])
        x.bio_details = team[uname];
        if(!x.bio_details)
          x.bio_details=team["Nxtmind"]
        this.users.push(x);
      }
      return this.api.getGitIssues();
    }).then((issues:any)=>{
      for(let i of issues){
        this.total_issues++;
        let name = i["user"]["login"].toLowerCase();
        for(let u of this.users)
          if(u.name == name)
            u.issues++;
      }
    });
  }

}
class User {
  public issues:number=0;
  public bio_details:any;
  constructor(public name:String, public avatar:String, public count:number){}
}
