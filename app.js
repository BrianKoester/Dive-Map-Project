/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var moment = require('moment');
var moment = require('moment-timezone');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// MongoDB
// Create to the DB if it doesn't exist and connect to it
MongoURL = process.env.MONGOHQ_URL || 'mongodb://localhost'
console.log('mongoURL ', MongoURL);
mongoose.connect(MongoURL)

// setup and define mongoDB collection
var DiveSite = mongoose.model('DiveSite', { location: String,
											    site: String,
										        date: Date,
										  conditions: String,
											   other: String,
											     lon: Number,
											     lat: Number});


//renders the index page
app.get('/', function(req, res){
	res.render('index')
});



//renders the edit-profile page
app.get('/editProfile', function(req, res){
	var editID = (req.query.id);

   //find the record from Divesite collection using editID
    DiveSite.findOne({_id: editID}, function(err, data){

    	// convert database date back to original inception date time zone
    	// and format for date-type necessary for jade view
        var dataObject = data.toObject({transform: function(doc, ret, z){
        	ret.date = moment(data.date).tz("GMT").format("YYYY-MM-DD");
        }});
    
        //send the Divesite data to the client
        res.render('edit-profile', dataObject);
    });
});



//finds record associated with clicked marker
app.get('/markerSearch', function(req, res){
	var diveID = (req.query.searchID);

   //find the record from Divesite collection using diveID
    DiveSite.findOne({_id: diveID}, function(err, data){
        //send the Divesitedata to the client
        res.send('DivesiteData', data);
    });
});



//send dive data to divemap.js to populate map
app.get('/loadSites', function(req, res){

   //Pull everything from our Divesite collection and send it to the client
    DiveSite.find({}, function(err, data){
        //send the DivesiteData back to client
        console.log('data ', data);
        console.log('err ', err);
        res.send('DivesiteData', {'data': data});
    });
});



//sends lon & lat data and then renders the profile page
app.get('/profile', function(req, res){
	var lon = req.query.lon;
	var lat = req.query.lat;
	res.render('profile', {lon: lon, lat: lat});
});



// creates a new DiveSite
app.post('/profile', function(req, res){
	var newDiveSite = new DiveSite({    location: req.body.location,
										    site: req.body.site,
									        date: req.body.date,
									  conditions: req.body.conditions,
										   other: req.body.other,
										     lat: req.body.lat,
											 lon: req.body.lon });
	newDiveSite.save();
	res.send({success: 'Success!'});
});



// creates a new DiveSite
app.post('/updateProfile', function(req, res){

 	// updates edited record
	DiveSite.update({_id: req.body._id}, {location: req.body.location,
										      site: req.body.site,
									          date: req.body.date,
									    conditions: req.body.conditions,
									         other: req.body.other,
										       lat: req.body.lat,
											   lon: req.body.lon },
					function (err, numberAffected, raw) {
						if (err) return handleError(err);
						console.log('The number of updated documents was %d', numberAffected);
						console.log('The raw response from Mongo was ', raw);
					});

    res.send({success: 'Success!'});
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
