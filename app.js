var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var firebase = require('firebase');
var fs = require("fs");

var config = {
  apiKey: "AIzaSyCyxGKMh0oA45q0EpnfqRJN6RERXW_Fq7Q",
  authDomain: "lakon-a6cdc.firebaseapp.com",
  databaseURL: "https://lakon-a6cdc.firebaseio.com",
  storageBucket: "lakon-a6cdc.appspot.com",
};
firebase.initializeApp(config);

// Route Files
var routes = require('./routes/index');
var products = require('./routes/products');
var events = require('./routes/events');
var users = require('./routes/users');

// Init App
var app = express();

app.locals.fb = firebase;
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logger
app.use(logger('dev'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.currentUser = firebase.auth().currentUser;
  next();
});

// Routes
app.use('/', routes);
app.use('/products', products);
app.use('/events', events);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

// Run Server
app.listen(app.get('port'), function(){
  console.log('Server started on port: '+app.get('port'));
});
