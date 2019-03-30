const express = require('express')
const rp = require('request-promise');
var cors = require('cors')
var cheerio = require('cheerio');

const app = express()
app.use(cors())

app.use(express.json());

const port = process.env.PORT || 3000
const fskey = process.env.FlightKey;
const hkey = process.env.HotelKey;

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
function flightUrl(orig,dest,date,retdate){
    var options = {
        method: "POST",
        uri: "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0",
        headers: {
            'X-RapidAPI-Key': fskey,
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        form:{
            'inboundDate' : retdate,
            'outboundDate' : date,
            'country' : 'US',
            'currency' : 'USD',
            'locale' : 'en-US',
            'originPlace' : orig+'-sky',
            'destinationPlace' : dest+'-sky',
            'adults' : 1
        },
        json: true, // Automatically parses the JSON string in the response
        transform: _include_headers
    };
    console.log(options['uri'])
    return options;
}
function flightgetUrl(key){
    let base = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/";
    let code = key.split("/").slice(-1)[0]
    console.log(base + code);
    var options = {
        uri: base + code,
        qs: {
            pageIndex : 0,
            pageSize : 10,
        },
        headers: {
            'X-RapidAPI-Key': fskey,
        },
        json: true // Automatically parses the JSON string in the response
    };
    return options;
}
function hotelUrl(checkin, checkout, lat, long){
    let base = "https://apidojo-booking-v1.p.rapidapi.com/properties/list";
    console.log(base);
    var options = {
        uri: base,
        qs: {
            search_type : 'latlong',
            offset : '0',
            guest_qty : '1',
            arrival_date : checkin,
            departure_date : checkout,
            latitude : lat,
            longitude: long,
            room_qty : '1',
            price_filter_currencycode : 'USD',
            order_by : 'popularity', 
            languagecode : 'en-us',
        },
        headers: {
            'X-RapidAPI-Key': hkey,
        },
        json: true // Automatically parses the JSON string in the response
    };
    return options;
}

function hotelgetLocationURL(location){
    let base = "https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete";
    console.log(base);
    var options = {
        uri: base,
        qs: {
            text : location,
            languagecode : 'en-us',
        },
        headers: {
            'X-RapidAPI-Key': hkey,
        },
        json: true // Automatically parses the JSON string in the response
    };
    return options;
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
            resort["weather"]=row["weatherWidget"][0]["weather_symbol"];
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
    let checkin= req.body.checkin;
    let checkout= req.body.checkout;
    let location= req.body.location;

    if(checkin == null || checkout == null || location == null){
        res.send(500,"args wrong or unsupported state");
        return;
    }
    rp(hotelgetLocationURL(location))
    .then((response)=> {
        console.log(response);
        var lat = 0.0;
        var long = 0.0;
        if(response[0] != null) {
            lat = response[0]['latitude'];
            long = response[0]['longitude'];
        }
        return rp(hotelUrl(checkin, checkout, lat, long))
    })
    .then((hotelDataResponse)=> {
        console.log(hotelDataResponse);
        data = []
        returnthing = {data};

        for(let hotel of response['result']){
            let thishotel = {};
            thishotel['hotel_name'] = hotel['hotel_name']
            thishotel['hotel_price'] = hotel['price_breakdown']['all_inclusive_price']
            thishotel['address'] = hotel['address']
            thishotel['rating'] = ['review_score']
            returnthing['data'].push(thishotel);
        }

        res.send(JSON.stringify(returnthing["data"]))
    })
    
})
var _include_headers = function(body, response, resolveWithFullResponse) {
    return {'headers': response.headers, 'data': body};
  };
app.post('/flight',(req, res) => {
        //Request must have state, price asc and decending
        let orig= req.body.orig;
        let dest= req.body.dest;
        let date= req.body.date;
        let retdate= req.body.retdate;

        if(orig == null || dest == null || date == null){
            res.send(500,"args wrong or unsupported state");
            return;
        }
        rp(flightUrl(orig,dest,date,retdate))
        .then((res)=>{
            console.log(res);
            var key = res.headers['location'];
            return rp(flightgetUrl(key))
        })
        .then((response)=>{
            data = []
            returnthing = {data};
            var count = 0;
            var arr = [];
            var k = 0;
            for(let leg of response['Legs']){
                var part = [leg['Id'],k];
                k++;
                arr.push(part);
            }
            var Legmap = new Map(arr);
            k=0;
            var arr2 = [];
            for(let carrier of response['Carriers']){
                var part = [carrier['Id'],k];
                k++;
                arr2.push(part);
            }
            var Carriermap = new Map(arr2)
            for(let trip of response['Itineraries']){
                let thistrip = {};
                thistrip['price'] = trip['PricingOptions'][0]['Price']
                var i = Legmap.get(trip['OutboundLegId']);
                var j = Legmap.get(trip['InboundLegId']);
                thistrip['leave_time1'] = response['Legs'][i]['Departure'];
                thistrip['arrive_time1'] = response['Legs'][i]['Arrival'];
                thistrip['leave_time2'] = response['Legs'][j]['Departure'];
                thistrip['arrive_time2'] = response['Legs'][j]['Arrival'];

                thistrip['airline'] = response['Carriers'][Carriermap.get(response['Legs'][i]['Carriers'][0])]['Name'];
                count++;
                returnthing['data'].push(thistrip);
            }
            res.send(JSON.stringify(returnthing["data"]));
        })
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))