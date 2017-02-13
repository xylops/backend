var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');

var config = require('../config'); // get our config file
var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var auth = require('./jwtAuth');

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

router.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            bcrypt.compare(req.body.pw, user.password, function(err, result) {
                if (result) {
                    // if user is found and password is right
                    // create a token
                    // var token = jwt.sign(user, config.secret, {
                    //     expiresIn: 500 // expires in 24 hours
                    // });


                    jwt.sign({
                        user: user,
                        exp: 500
                    }, config.secret, { algorithm: 'HS256' }, function(err, token) {
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    })

                    // return the information including token as JSON


                } else {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
});

// route middleware to verify a token


module.exports = router
