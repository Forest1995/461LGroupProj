import { LoadingController} from 'ionic-angular';
import { Http ,RequestOptions, Headers} from '@angular/http';

export class ServerRequest{
    private static _instance : ServerRequest;
    public cached : any;
    constructor(private http: Http,public loadingCtrl: LoadingController) {
        this.cached = {};
    }
    public static Instance(http?: Http,loadingCtrl?: LoadingController){
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this(http,loadingCtrl));
    }
    public getGitStats(){
        return this.apiGetDirectCall("https://api.github.com/repos/jmm9683/461LGroupProj/stats/contributors")
            .then((response : string)=>{
                return JSON.parse(response)
            });  

    }
    public getGitIssues(){
        return this.apiGetDirectCall("https://api.github.com/repos/jmm9683/461LGroupProj/issues")
            .then((response : string)=>{
                return JSON.parse(response)
            });  
    }  
    private presentLoading() {
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
      
        loading.present();
        
        setTimeout(() => {
          loading.dismiss();
        }, 20000);
        return loading;
    }
    private apiDirectCall(url,data,no_load?:boolean ,force_reject?:boolean){
        //show loading if no_load is false or null
        let load = (!no_load) ? this.presentLoading() : null;
        return new Promise((resolve,reject) => {
                const headers = new Headers({ 'Content-Type': 'application/json'});
                let options = new RequestOptions({ headers: headers });
                this.http.post(url,data,options).subscribe((response)=>{
                    if(load)
                        load.dismiss();
                    resolve(response["_body"]);
                },
                (error)=>{
                    if(load)
                        load.dismiss();
                    alert("sal");
                    console.log(error["_body"]);
                    if(force_reject)reject(error["_body"]);
                });
        });
    }
    private apiGetDirectCall(url,no_load?:boolean ,force_reject?:boolean){
        //show loading if no_load is false or null
        let load = (!no_load) ? this.presentLoading() : null;
        return new Promise((resolve,reject) => {
                const headers = new Headers({ 'Content-Type': 'application/json'});
                let options = new RequestOptions({ headers: headers });
                this.http.get(url,options).subscribe((response)=>{
                    if(load)
                        load.dismiss();
                    resolve(response["_body"]);
                },
                (error)=>{
                    if(load)
                        load.dismiss();
                    console.log(error["_body"]);
                    if(force_reject)reject(error["_body"]);
                });
        });
    }
}