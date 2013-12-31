
/**
 * Module dependencies.
 */
var express = require('express');
  routes = require('./routes'),
  user = require('./routes/user'),
  path = require('path'),
  everyauth = require('everyauth'),
  RedisStore = require('connect-redis')(express),
  redis = require('redis').createClient(),
  sessionStore = new RedisStore(),
  conf = require('./node//conf'),
  facebook = require('./node/facebook_connection')

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
//sessionStore is used to tell the session manager where to put all the session data
app.use(express.session({secret: '1234567890QWERTY'}, sessionStore));
app.use(everyauth.middleware());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/', routes.index);
//app.get('/users', user.list);

server = server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

var zombies = [];
var players = [];

function spawnZombie(){
  var zombie = {id: 123, x: playerx + 100};
  zombies.push(zombie);
}
//socket data
io.sockets.on('connection', function(socket) {
  socket.on('init', function(){
    socket.emit('init');
  });

  socket.on('addPlayer', function(player){
    players.push(player);
  });

  socket.on('bulletFired', function(bullet){
    //handle collision
  });

});