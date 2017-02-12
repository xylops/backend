var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('index', { title: 'Hey', message: 'Hello This is the backend page!' })
})

module.exports = router
