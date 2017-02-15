var config = require('../config'); // get our config file
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require('../models/user')

module.exports = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err){
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                User.findOne({token: token}, function(err, user){
                    if(err) throw err;
                    // if everything is good, save to request for use in other routes
                    if(user){
                        req.decoded = decoded;
                        next();
                    }else{
                        return res.json({
                            success: false,
                            message: 'Failed to authenticate token.'
                        });
                    }
                })
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
}
