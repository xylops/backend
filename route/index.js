var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');
const MongoClient = require('mongodb').MongoClient
var bcrypt = require('bcryptjs');


var config = require('../config'); // get our config file
var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, (err, database)=>{
    if (err) return console.log(err)
    db = database;
    console.log('connnect to db through mongoose');
})


router.get('/', function(req, res, next){
    res.render('index', { title: 'Hey', message: 'Hello This is the backend page!' })
})

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res){
    var {id, pw, pw2} = req.body

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
})

router.get('/login', function(req, res, next){
    res.render('login')
})

router.post('/login', function(req, res){

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
                if (result) {
                    // if user is found and password is right
                    // create a token
                    // var token = jwt.sign(user, config.secret, {
                    //     expiresIn: 1440 // expires in 24 hours
                    // });

                    jwt.sign({
                        user: user,
                        expiresIn: '1m'
                    }, config.secret, { algorithm: 'HS256' }, function(err, token) {
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
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
})

module.exports = router
