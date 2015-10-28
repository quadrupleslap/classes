var express = require('express');
var session = require('express-session');
var compression = require('compression');
var path = require('path');
var pgSession = require('connect-pg-simple')(session);

var PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IP = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var app = express();

app.use(compression());

app.use(session({
  store: new pgSession({
    conString: process.env.DATABASE_URL
      || process.env.OPENSHIFT_POSTGRESQL_DB_URL
  }),
  secret: process.env.COOKIE_SECRET, //TODO: No seriously, we need a better secret.
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 90 * 24 * 60 * 60 * 1000 } // 90 Days
}));

app.use(express.static( path.join(path.dirname(__dirname), 'public') ));

require('./auth')(
  app,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

app.listen(PORT, IP, function () {
  console.log('Server up on ' + IP + ':' + PORT + '!');
});