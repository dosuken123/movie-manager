'use strict';
var User   = require('../../app/models/user'); // get our mongoose model
var dbconfig = require('../../config/config'); // get our config file
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
module.exports = {signup, signin, getAllUsers};

function signup(req, res, next) {
  // create a sample user
  var user = new User({ 
    name: req.body.name, 
    email: req.body.email,
    password: req.body.password
  });

  // save the sample user
  user.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ 
        success: true,
        description: "Succeeded signup." });
  });
}

function signin(req, res, next) {
  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      // res.json({ message: 'Authentication failed. User not found.' });
      res.status(500).json({ message: 'Authentication failed. User not found.' });
      // res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.status(500).send({ message: 'Authentication failed. Wrong password.' });
        // res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        console.log('if user is found and password is right');
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, dbconfig.secret, {
          expiresIn: 1440 // expires in 24 hours
        });

        console.log('return the information including token as JSON');
        // return the information including token as JSON
        res.json({
          success: true,
          description: 'Enjoy your token!',
          token: token
        });
      }   
    }
  });
}

function getAllUsers(req, res, next) {
  // res.json({ movies: db.find()});
  User.find({}, function(err, users) {
    res.json({users: users});
  });
}