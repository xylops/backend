var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');

var config = require('../config');
//connect to database and set auto reconnect
mongoose.Promise = global.Promise;
mongoose.connection.on("open", function(ref) {
  return console.log("Connected to mongo server!");
});

mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!");
  return console.log(err.message.red);
});

try {
  mongoose.connect("mongodb://" + config.database);
  db = mongoose.connection;
  console.log("Started connection on " + config.database);
} catch (err) {
  console.log("Setting up failed to connect to " + config.database);
}

//routing for pages
router.get('/', function(req, res, next){
    res.render('index', { title: 'Hey', message: 'Hello This is the backend page!' })
})

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/login', function(req, res, next){
    res.render('login')
})


module.exports = router
