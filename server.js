var express = require('express');
var bodyParser = require("body-parser");
var fs = require('fs');
var matchList = require('./data/match.json');   
var teamMap = require('./data/team.json');   
var venueMap = require('./data/venue.json'); 
var _ = require('lodash');  

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// template call for venue, team, card htmls'
var cardHtmlFileContent = _.template(fs.readFileSync(__dirname+'/htmlFiles/card.html', 'utf8'));
var venueHtmlFileContent = _.template(fs.readFileSync(__dirname+'/htmlFiles/filterButton.html', 'utf8'));

app.listen(3000, function () {
  console.log('server listening on port 3000. please open localhost:3000')
})

app.get('/getCardData',function(req,res){
   res.json( getCardHtml(getAllCards()) );
})

app.get('/getVenueData' , function(req,res){
    res.json(getv1(venueMap,"venue"));
})

app.get('/getTeamData', function(req,res){
  res.json(getv1(teamMap,"team"));
})

// POST method route path getCardDataByFilter
app.post('/getCardDataByFilter', function(req,res){
  var filterType=req.body.filterType;
  var id = req.body.id;
  if (filterType == 'venue')
    res.json(getCardHtml(filterByVenue(id)));
  
  else
    res.json(getCardHtml(filterByTeam(id)));
  
})

function getv1(venueMap, filterType1){
  var v1="";
  if(filterType1 == "venue"){
        Object.keys(venueMap).forEach(function(venue,i) {
        v1+=(venueHtmlFileContent({'filterName':venueMap[venue].name, 'filterKey':i+1 , 'filterType': "venue"}));
    });
      }
      else{
        Object.keys(teamMap).forEach(function(team) {
        v1+=(venueHtmlFileContent({'filterName':teamMap[team].s_name, 'filterKey': team, 'filterType': "team"}));
         });
      }

return v1;
}

function getCardHtml(cardList){
  var v2="";
cardList.forEach(function(card){
  v2+= cardHtmlFileContent({'card_matchName': card.matchName, 'card_date': card.date , 'card_stadium': card.stadium, 'card_status': card.status });
});
return v2;
}


function getAllCards(){
var cardList=[];
matchList.forEach(function(match){
       cardList.push(createCard(match));
});
return cardList;
}

function createCard(match){
  return { 
            matchName: teamMap[match.team1_id].s_name + ' vs ' + teamMap[match.team2_id].s_name + ', ' + match.header.match_desc ,
            date : datefn(match.header.start_time),
            stadium: venueMap[match.venue_id].name,
            status: match.header.status 
          }
}

//convert unix date 
function datefn(unix_tm) {
  var dt = new Date(unix_tm*1000).toUTCString();
  dt=dt.split(' ').slice(0, 4).join(' ');
  return dt;
}

// filter by team selected
function filterByTeam(id){
  var cardList=[];
  matchList.forEach(function(match){
  if(match.team1_id == id || match.team2_id == id){
        cardList.push( createCard(match) )
      }
    })  
  return cardList;
}

//filter by Venue selected
function filterByVenue(id){
  var cardList=[];
  matchList.forEach(function(match){
  if(match.venue_id == id){
        cardList.push( createCard(match) )
      }
    })
  return cardList;[]
}



































