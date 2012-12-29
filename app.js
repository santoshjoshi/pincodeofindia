
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');


var service =  require('./service/service')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);


app.param(function(name, fn){
	  if (fn instanceof RegExp) {
	    return function(req, res, next, val){
	      var captures;
	      if (captures = fn.exec(String(val))) {
	        req.params[name] = captures;
	        next();
	      } else {
	        next('route');
	      }
	    }
	  }
	});

/**
* validations
*/

app.param('id', /^\w+$/);
app.param('stateId', /^\d+$/);
app.param('districtId', /^\d+$/);
app.param('term', /^\w+$/);

app.get('/getStates/:id', function(req, res){
    service.states(req.params.id, res);
});

app.get('/getDistricts/:stateId/:term', function(req, res){
    service.districts(req.params.stateId, req.params.term,  res);
});

app.get('/getPinCode/:stateId/:districtId/:term', function(req, res){
    service.pincodes(req.params.stateId, req.params.districtId, req.params.term,  res);
});

app.get('/contact', function(req, res){
  res.render('contact', {title: 'Contact',test:'santosh'});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
