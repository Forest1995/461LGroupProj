const express = require('express')
const rp = require('request-promise');
var cheerio = require('cheerio');

const app = express()
app.use(express.json());

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

const stateDB ={
    "CO":251,
    "NH":252,
    "CA":89,
    "MI":195,
    "WI":232,
    "NY":234,
    "PA":249,
    "ME":457,
    "WA":477,
    "NC":734,
    "MN":763
}
function onTheSnowUrl(state,type){
    return "https://skiapp.onthesnow.com/app/widgets/resortlist?region=us&regionids="+state+"&language=en&pagetype="+type+"&direction=-1&order=stop&limit=100&offset=0&countrycode=USA&minvalue=-1&open=anystatus"
}
app.post('/resort',(req, res) => {
    //Request must have state, price asc and decending
    let stateCode = stateDB[req.body.state];
    let price = req.body.price;
    if(price == null || stateCode == null){
        res.send(500,"args wrong or unsupported state");
        return;
    }
    let returnObject={};
    //skireport
    rp({uri:onTheSnowUrl(stateCode,"profile"),json:true})
    .then((data)=>{
        for(let row of data["rows"]){
            let resort ={};
            resort["id"]=row["_id"];
            resort["name"]=row["resort_name"];
            resort["rating"]=row["reviewTotals"]["overall"];
            resort["isOpen"]=row["snowcone"]["open_flag"];
            returnObject[resort["id"]] = resort;
        }
        return rp({uri:onTheSnowUrl(stateCode,"skireport"),json:true})
    })
    .then((data)=>{
        for(let row of data["rows"]){
            let resort =returnObject[row["_id"]];
            resort["snowfall"]=row["pastSnow"]["sum3"];
            resort["snowdepth"]=row["snowcone"]["top_depth_cm"];
            resort["weather"]=row["weatherWidget"]["weather_symbol"];
            resort["cost"]=null;
            returnObject[resort["id"]] = resort;
        }
        return rp({uri:"https://www.onthesnow.com/united-states/lift-tickets.html",transform:(body)=>cheerio.load(body)})
        
    })
    .then(($)=>{
        //"scrape" webpage using jquery
        $($("tbody")[0]).children().each((i,row)=>{
            if(i==0)return;
            let name= $($(row).children()[0]).text();
            let cost= parseFloat($($(row).children()[2]).text().substring(4));
            for(let resort of Object.values(returnObject)){
                if(resort["name"].indexOf(name)==0){
                    resort["cost"]=cost;
                    returnObject[resort["id"]]=resort;
                }
            }
        })
        let resort_array = Object.values(returnObject);
        for(let resort in resort_array){
            if(isNaN(resort_array[resort]["cost"])){
                resort_array[resort]["cost"]=null;
            }
        }
        resort_array.sort((a,b)=>{
            if (a["cost"] === b["cost"])
                return 0;
            else if (a["cost"] === null)
                return 1;
            else if (b["cost"] === null)
                return -1;
            else if (price==0)
                return a["cost"] < b["cost"] ? -1 : 1;
            else if (price==1)
                return a["cost"] < b["cost"] ? 1 : -1;
        })
        res.send(JSON.stringify(resort_array));
    })
    
})
app.post('/hotel',(req, res) => {
    res.send('Hello World!')
})
app.post('/flight',(req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))