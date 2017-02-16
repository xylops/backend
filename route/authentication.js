var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');
const MongoClient = require('mongodb').MongoClient
var bcrypt = require('bcryptjs');
var moment = require('moment');
var jwt    = require('jsonwebtoken');

var config = require('../config'); // get our config file
var User   = require('../models/user'); // get our mongoose model

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
            //compare password with hash
            bcrypt.compare(req.body.pw, user.password, function(err, result) {
                var modifyUser = {};
                modifyUser.name = user.name;
                modifyUser.admin = user.admin;
                if (result) {
                    //issue new token
                    jwt.sign({
                        //payload
                        user: modifyUser
                    }, config.secret, {
                        //jwt options
                        algorithm: 'HS256',
                        expiresIn: config.tokenExpiredIn,
                    }, function(err, token) {
                        User.findOneAndUpdate({name: user.name}, {$set:{token: token}}, {upsert: true}, function(err, data){
                            if(err) throw err;
                            res.setHeader('x-access-token', token)
                            return res.json({
                                success: true,
                                message: 'Enjoy your token!!!!!',
                                token: token
                            });
                        })
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

router.post('/refreshToken', function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if( token ){
        jwt.verify( token, config.secret, function(err, decoded) {
            var payload = jwt.decode(token);
            var currentTime = ( moment().format('x') )/1000;

            if(err){                                        // check if there are any error with toke
                if (err.name === 'TokenExpiredError' ) {    //check if error is cause by token expired

                    if(!payload.firstTokenIssueAt){
                        var tokenTime = ( moment(err.expiredAt).format('x') )/1000;
                    } else {
                        var tokenTime = payload.firstTokenIssueAt;
                    }
                    var forceExpired = currentTime - tokenTime < config.forceExpired
                    var payload = {
                        user: payload.user,
                        firstTokenIssueAt: tokenTime
                    }

                    if(forceExpired){
                        jwt.sign(payload, config.secret, {
                            algorithm: 'HS256',
                            expiresIn: config.tokenExpiredIn,
                        }, function(err, token) {
                            User.findOneAndUpdate({name: payload.user.name}, {$set:{token: token}}, {upsert: true}, function(err, data){
                                if(err) throw err
                                return res.json({
                                    success: true,
                                    message: 'Enjoy your token!!!!!',
                                    token: token
                                });
                            })
                        })
                    }else{
                        return res.json({
                            success: false,
                            message: 'Expired token.'
                        });
                    }
                } else {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                }
            }else{

                if(payload.firstTokenIssueAt){
                    var firstTokenIssueAt = payload.firstTokenIssueAt
                }else{
                    var firstTokenIssueAt = payload.iat
                }
                var payload = {
                    user: payload.user,
                    firstTokenIssueAt
                }

                jwt.sign(payload, config.secret, {
                    algorithm: 'HS256',
                    expiresIn: config.tokenExpiredIn
                }, function(err, token) {
                    User.findOneAndUpdate({name: payload.user.name}, {$set:{token: token}}, {upsert: true}, function(err, data){
                        if(err) throw err
                        return res.json({
                            success: true,
                            message: 'Enjoy your token!!!!!',
                            token: token
                        });
                    })
                })
            }

        });
    }else{
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
})


module.exports = router
