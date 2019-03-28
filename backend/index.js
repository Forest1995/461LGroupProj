const express = require('express')
const rp = require('request-promise');

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

app.post('/resort',(req, res) => {
    //Request must have state, price asc and decending
    let stateCode = stateDB[req.body.state];
    let price = req.body.price;
    if(!price || !stateCode){
        res.send(500,"args wrong or unsupported state");
        return;
    }
    let returnObject={};
    //skireport
    rp("https://skiapp.onthesnow.com/app/widgets/resortlist?region=us&regionids="+stateCode+"&language=en&pagetype=profile&direction=-1&order=stop&limit=100&offset=0&countrycode=USA&minvalue=-1&open=anystatus")
    .then((res)=>JSON.parse(res))
    .then((data)=>{
        for(let row of data["rows"]){
            let resort ={};
            resort["id"]=row["_id"];
            resort["name"]=row["resort_name"];
            //add other stuff
            returnObject.push(resort);
        }
        res.send(JSON.stringify(returnObject))
    })
    
})
app.post('/hotel',(req, res) => {
    res.send('Hello World!')
})
app.post('/flight',(req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))