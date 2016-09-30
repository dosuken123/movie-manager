'use strict';
var Movie   = require('../../app/models/movie'); // get our mongoose model
var User   = require('../../app/models/user'); // get our mongoose model
var dbconfig = require('../../config/config'); // get our config file
// var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var express     = require('express');
// var app         = express();
module.exports = {getAll, save};

// TODO: If user doesn't have a token, Deny the access.
// route middleware to verify a token

function getAll(req, res, next) {
  console.log('getAll...');
  // TODO: Detect user by token
  Movie.find({}, function(err, movies) {
    res.json({movies: movies});
  });
}

function save(req, res, next) {

  // // check header or url parameters or post parameters for token
  // var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // // decode token
  // if (!token) {
  //   // if there is no token
  //   // return an error
  //   return res.status(403).send({ 
  //       success: false, 
  //       message: 'No token provided.' 
  //   });
  // }
  // console.log('jwt.verify...');
  // // verifies secret and checks exp
  // jwt.verify(token, dbconfig.secret, function(err, decoded) {      
  //   if (err) {
  //     return res.json({ success: false, message: 'Failed to authenticate token.' });    
  //   } else {
  //       // if everything is good, save to request for use in other routes
  //       console.log('decoded : ' + decoded);
  //       req.decoded = decoded;    
  //       // next();
  //     }
  //   });

  console.log('User.findOne...');
  console.log('req.decoded : ' + req.decoded);
  User.findOne({id: token.id}).exec(function findOneCB(err, found){
    if(err) res.status(500).send({ message: 'No user.' }); //next(err);
    req.currentUser = found;
    // next();
  });

  // TODO: Detect user by token
  var movie = new Movie({ 
    user_id: req.currentUser.id, 
    title: req.body.title, 
    year: req.body.year
  });

  // save the sample user
  movie.save(function(err) {
    if (err) throw err;

    console.log('Movie saved successfully');
    res.json({ 
        success: true,
        description: "Succeeded save movie." });
  });
}

// //GET /movie/{id} operationId
// function getOne(req, res, next) {
//     var id = req.swagger.params.id.value; //req.swagger contains the path parameters
//     var movie = db.find(id);
//     if(movie) {
//         res.json(movie);
//     }else {
//         res.status(204).send();
//     }       
// }
// //PUT /movie/{id} operationId
// function update(req, res, next) {
//     var id = req.swagger.params.id.value; //req.swagger contains the path parameters
//     var movie = req.body;
//     if(db.update(id, movie)){
//         res.json({success: 1, description: "Movie updated!"});
//     }else{
//         res.status(204).send();
//     }

// }
// //DELETE /movie/{id} operationId
// function delMovie(req, res, next) {
//     var id = req.swagger.params.id.value; //req.swagger contains the path parameters
//     if(db.remove(id)){
//         res.json({success: 1, description: "Movie deleted!"});
//     }else{
//         res.status(204).send();
//     }

// }