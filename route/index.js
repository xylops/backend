var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');

var config = require('../config');
//connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, (err, database)=>{
    if (err) return console.log(err)
    db = database;
    console.log('connnect to db through mongoose');
})

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
