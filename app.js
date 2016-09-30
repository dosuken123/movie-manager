'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express     = require('express');
var app = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var dbconfig = require('./config/config'); // get our config file
mongoose.connect(dbconfig.database); // connect to database

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  console.log('verify a token...');
  console.log('req.body.token : ' + req.body.token);
  console.log('req.query.token : ' + req.query.token);
  console.log('req.headers[x-access-token] : ' + req.headers['x-access-token']);
  console.log("req.headers : %j", req.headers);

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  console.log('decode token...');
  console.log('token : ' + token);
  // decode token
  if (token) {

    console.log('jwt.verify...');
    // verifies secret and checks exp
    jwt.verify(token, dbconfig.secret, function(err, decoded) {      
      if (err) {
        console.log('jwt.verify err...');
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        console.log('jwt.verify suceeded...');
        console.log("decoded : %j", decoded);
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    console.log('if there is no token...');
    // if there is no token
    // return an error
    // return res.status(403).send({ 
    //     success: false, 
    //     message: 'No token provided.' 
    // });
    return res.status(500).json({ message: 'No token provided.' });
    
  }
});
// apply the routes to our application with the prefix /api
app.use('/movie', apiRoutes);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
