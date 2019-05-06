const express = require('express')
const rp = require('request-promise');
var cors = require('cors')
var cheerio = require('cheerio');
var mongo = require('mongoose');
var fs = require('fs')
mongo.Promise = require('bluebird');
var tripSchema, Trip
var airportCodeMap = null;

mongo.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/datastore",{
    user:process.env.mdb_user,
    pass:process.env.mdb_password,
    useMongoClient:true,
}).then(()=>{
    tripSchema = new mongo.Schema({}, { strict: false });
    Trip = mongo.model('Thing', tripSchema);   
}).catch(err=>{
    console.error(err);
    process.exit(-1);
});

const app = express()
app.use(cors())

app.use(express.json());

const port = process.env.PORT || 3000
const fskey = process.env.FlightKey;
const hkey = process.env.HotelKey;
const imageKey = process.env.ImageKey;
const geocodekey = process.env.GeocodeKey;

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
function onImageUrl(name, id) {
    const options = {
        uri: `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${name}+ski+resort&count=1&offset=0&mkt=en-us&safeSearch=Moderate`,
        headers: {
            'Ocp-Apim-Subscription-Key': imageKey
        },
        json: true 
    }
    return rp(options).then((data) => {
        return data
    }).catch((err) => {
        console.log("err in" + name)
    })
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
            pageSize : 100,
        },
        headers: {
            'X-RapidAPI-Key': fskey
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
            'X-RapidAPI-Key': hkey
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
    if(airportCodeMap == null){
        fillAirportCodes();
    }
    let stateCode = stateDB[req.body.state];
    let price = req.body.price;
    if(price == null || stateCode == null){
        res.send(500,"args wrong or unsupported state");
        return;
    }
    let returnObject={};
    let postoID = []
    //skireport
    rp({uri:onTheSnowUrl(stateCode,"profile"),json:true})
    .then((data)=>{
        let imgReqs = []
        for(let row of data["rows"]){
            let resort ={};
            resort["id"]=row["_id"];
            resort["name"]=row["resort_name"];
            resort["rating"]=row["reviewTotals"]["overall"];
            resort["isOpen"]=row["snowcone"]["open_flag"];
            resort["slopesOpen"]=row["snowcone"]["num_trails_slopes_open"];
            returnObject[resort["id"]] = resort;
            imgReqs.push(onImageUrl(resort["name"], resort["id"]))
            postoID.push(resort["id"])
        }
        return Promise.all(imgReqs)
    })
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            if (!data[i]) {
                returnObject[postoID[i]].imageUrl = ""
            }  else {
                returnObject[postoID[i]].imageUrl = data[i].value[0].contentUrl
            }
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
        if (price == 0 || price == 1){
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
          }
          if (price == -1){
            resort_array.sort((a,b)=>{
                if (a["rating"] === b["rating"])
                    return 0;
                else if (a["rating"] === null)
                    return 1;
                else if (b["rating"] === null)
                    return -1;
                else
                    return a["rating"] > b["rating"] ? -1 : 1;
                  })
          }
          if (price == 2){
            resort_array.sort((a,b)=>{
                if (a["slopesOpen"] === b["slopesOpen"])
                    return 0;
                else if (a["slopesOpen"] === null)
                    return 1;
                else if (b["slopesOpen"] === null)
                    return -1;
                else
                    return a["slopesOpen"] < b["slopesOpen"] ? 1 : -1;
                  })
          }
          
        res.send(JSON.stringify(resort_array));
    })

})
app.post('/hotel',(req, res) => {
    let checkin= req.body.checkin;
    let checkout= req.body.checkout;
    let location= req.body.location;
    let price = req.body.price;

    if(checkin == null || checkout == null || location == null || price == null){
        res.send(500,"args wrong or unsupported state");
        return;
    }

    if(geocodekey==null){
        console.log('Need geocode api key');
    }
    // var name = req.body.name;
    locationPromise(location).then((info)=>{
        console.log('mystuff:');
        console.log(info);
        //res.send(JSON.stringify(info));
        return info
    })
    .then((latlong)=> {
        console.log(latlong);
        var lat = 0.0;
        var long = 0.0;
        if(latlong['longitude'] != null) {
            lat = latlong['latitude'];
            long = latlong['longitude'];
        }
        return rp(hotelUrl(checkin, checkout, lat, long))
    })
    .then((response)=> {
        data = []
        returnthing = {data};

        for(let hotel of response['result']){
            let thishotel = {};
            thishotel['hotel_name'] = hotel['hotel_name']
            if(hotel['price_breakdown'] !== undefined)
                thishotel['hotel_price'] = hotel['price_breakdown']['all_inclusive_price']
            else
                thishotel['hotel_price'] = null;
            thishotel['address'] = hotel['address']
            thishotel['rating'] = hotel['review_score']
            thishotel['imageUrl'] = hotel['main_photo_url']
            returnthing['data'].push(thishotel);
        }
        if (price == 0 || price == 1){
            returnthing['data'].sort((a,b)=>{
                if (a["hotel_price"] === b["hotel_price"])
                    return 0;
                else if (a["hotel_price"] === null)
                    return 1;
                else if (b["hotel_price"] === null)
                    return -1;
                else if (price==0)
                    return a["hotel_price"] < b["hotel_price"] ? -1 : 1;
                else if (price==1)
                    return a["hotel_price"] < b["hotel_price"] ? 1 : -1;
                  })
          }
          if (price == -1){
            returnthing['data'].sort((a,b)=>{
                if (a["rating"] === b["rating"])
                    return 0;
                else if (a["rating"] === null)
                    return 1;
                else if (b["rating"] === null)
                    return -1;
                else
                    return a["rating"] > b["rating"] ? -1 : 1;
                  })
          }
        res.send(JSON.stringify(returnthing["data"]))
    })
    
})
var _include_headers = function(body, response, resolveWithFullResponse) {
    return {'headers': response.headers, 'data': body};
  };

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
app.post('/flight',(req, res) => {
        //Request must have state, price asc and decending
        if(fskey == null){
            console.log('Local flight api key not set');
        }

        let orig= req.body.orig;
        let dest= req.body.dest;
        let date= req.body.date;
        let retdate= req.body.retdate;

        if(orig == null || dest == null || date == null){
            res.send(500,"args wrong or unsupported state");
            return;
        }
        if(orig.length>3){
            orig = orig.toLowerCase;
            orig = airportCodeMap.get(orig);
        }
        if(dest.length>3){
            orig = orig.toLowerCase;
            orig = airportCodeMap.get(orig);
        }
        rp(flightUrl(orig,dest,date,retdate))
        .then((res)=>{
            console.log(res);
            var key = res.headers['location'];
            var datatest = null;
            // while((datatest==null)||(datatest['Itineraries'].length()<10)){
            //     rp(flightgetUrl(key))
            //     .then((response)=>{
            //         datatest=response;
            //     })
            // }
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
                console.log(carrier)
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
                thistrip['imageUrl'] = response['Carriers'][Carriermap.get(response['Legs'][i]['Carriers'][0])]['ImageUrl'];
                count++;
                returnthing['data'].push(thistrip);
            }
            res.send(JSON.stringify(returnthing["data"]));
        })
    })
 
app.post('/trip',(req, res) => {
    var thing = new Trip(req.body);
    thing.save(function(err,trip) {
        res.send("https://skiwheredb.herokuapp.com/getTrip?id="+trip._id);
    });

});
app.get('/getTrip',(req, res) => {
    Trip.findOne({_id:req.query.id}).then((doc)=>{
        res.send(JSON.stringify(doc)); 
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//returns a {} with latitude and longitude attributes
function locationPromise(name){
    return new Promise((resolve,reject)=>{
        nameUri=name.replace(' ','+');
        //console.log('Uri:'+nameUri);
        urip = 'https://maps.googleapis.com/maps/api/geocode/json?address='+name+'&key='+geocodekey;
        rp({uri:urip}).then((data)=>{
            data = JSON.parse(data);
            //console.log('response:'+data['results'][0]['geometry']['location']['lat']);
            let responseboi = {};
            responseboi['latitude'] = data['results'][0]['geometry']['location']['lat'];
            responseboi['longitude'] = data['results'][0]['geometry']['location']['lng'];
            resolve(responseboi);
        })
    })
}


app.post('/location',(req, res)=>{
    if(geocodekey==null){
        console.log('Need geocode api key');
    }
    var name = req.body.name;
    locationPromise(name).then((info)=>{
        console.log('mystuff:');
        console.log(info);
        res.send(JSON.stringify(info));
    })
})

app.post('/maptest',(req,res)=>{
    if(airportCodeMap == null){
        fillAirportCodes();
    }
    res.send(JSON.stringify({'Yay':'yay'}));
})

function fillAirportCodes(){
    var maparray = [];
    fs.readFile('backend/airportcodes.txt','utf-8',function(err,data){
        if(err){throw err;}
        var textByLine = data.split("\n");
        for (var line of textByLine){
            var length = line.length;
            var value = line.substring(length-4,length-1);
            var slash = line.search('/');
            var comma = line.search(',');
            if(slash == -1){slash = 999;}
            var key = null;
            if(slash < comma){
                key = line.substring(0,slash);
            }else{
                key = line.substring(0,comma);
            }
            key = key.toLowerCase();
            var add = [key,value];
            maparray.push(add);
        }
        airportCodeMap = new Map(maparray);
        console.log(airportCodeMap.get('houston')+' we have filled the map');
    })
}