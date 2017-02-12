var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
var app = express();

//Routing
var initialization = require('./route')
//setting View Engine using Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Routing for page
app.use('/', initialization);

//Routing for API




//launching Nodejs server
//Set port
const PORT = process.env.PORT || 3000;
//For Heroku
app.use(function(req, res, next){
    if(req.headers['x-forwarded-proto'] === 'https'){
        res.redirect('http://' + req.hostname + req.url);
    }else{
        next();
    }
})
//Launch
app.listen(PORT, function(){
    console.log('Express server is up on port ' + PORT)
});
