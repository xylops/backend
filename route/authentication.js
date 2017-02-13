var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');
const MongoClient = require('mongodb').MongoClient
var bcrypt = require('bcryptjs');

var config = require('../config'); // get our config file
var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken');

//create users
router.post('/register', function(req, res){
    var {id, pw, pw2} = req.body

    User.findOne({
        name:req.body.id
    }, function(err, user){
        if(err) throw err;

        if(!user){
            if(pw === pw2){
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(pw, salt, function(err, hash) {
                        // create a sample user
                        var newUser = new User({
                            name: id,
                            password: hash,
                            admin: null
                        });
                        // // save the sample user
                        newUser.save(function(err) {
                            if (err) throw err;

                            console.log('User saved successfully');
                            res.json({ success: true });
                        });
                    });
                });
            }else{
                res.json({success: false, message: 'password are not the same' })
            }
        }else{
            res.json({success: false, message: 'user already exist' })
        }
    })


})


router.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        name: req.body.id
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            bcrypt.compare(req.body.pw, user.password, function(err, result) {
                var modifyUser = {};
                modifyUser.name = user.name;
                modifyUser.admin = user.admin;
                if (result) {
                    jwt.sign({
                        user: modifyUser

                    }, config.secret, { algorithm: 'HS256', expiresIn: 30 }, function(err, token) {
                        res.json({
                            success: true,
                            message: 'Enjoy your token!!!!!',
                            token: token
                        });
                    })
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

module.exports = router
