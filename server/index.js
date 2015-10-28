var express = require('express');
var session = require('express-session');
var compression = require('compression');
var path = require('path');

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IP = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var app = express();

app.use(compression());

app.use(session({
  secret: 'We need a better secret.', //TODO: No seriously, we need a better secret.
  saveUninitialized: false,
  resave: false
}));

app.use(express.static( path.join(path.dirname(__dirname), 'public') ));

require('./auth')(
  app,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

app.listen(PORT, IP, function () { console.log('Server up on ' + IP + ':' + PORT + '!'); });