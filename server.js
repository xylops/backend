var express = require('express');
var app = express();
var path = require('path');
var exphbs  = require('express-handlebars');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

//Routing
var initialization = require('./route')
var apiRoute = require('./route/api')

//setting View Engine using Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
//Routing for page
app.use('/', initialization);

//Routing for API
app.use('/api', apiRoute)

// =======================
// start the server ======
// =======================
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
