var express     = require('express');
var router      = express.Router();
var mongoose    = require('mongoose');

var config = require('../config'); // get our config file
var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var auth = require('../service/jwtAuth');

router.get('/',auth , function(req, res) {
    res.json({
        message: 'Welcome to the coolest API on earth!'
    });
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users',auth , function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

module.exports = router
