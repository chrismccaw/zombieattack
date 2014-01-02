
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
  uuid = require('node-uuid');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var cookieSecret = 'asddsfkjhs38975uy43tttsqldiu23joeey9834y58047yuopgppio5u6';

// all environments
app.configure(function() {
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(express.favicon());
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  //json and urlencoded will be the body parser
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.cookieParser());
  app.use(express.session({secret: cookieSecret, store: sessionStore}));
  app.use(everyauth.middleware());
  app.use(express.logger('dev'));
  app.use(app.router);
});

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
setInterval(function(){
  while(players.length > 0 && zombies.length < 10){
        spawnZombie();
  }
}, 1000);

function spawnZombie(){
  var zombie = {id: uuid.v4(), x: 150 + Math.floor(Math.random() * 100)};
  zombies.push(zombie);
  console.log('ZOMBIE');
  io.sockets.emit('spawnEnemy', zombie);
}

/*  SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);*/
//socket data
io.sockets.on('connection', function(socket) {

  socket.on('init', function(id){
    socket.emit('spawnPlayers', players);
    var player = {
      id: id
    }
    sessionStore.get(id, function(err, session){
      var data = {
        id :session.md.id,
        name: session.md.name
      }
      socket.broadcast.emit('spawnPlayers', data);
    });
    players.push(player);
  });

  socket.on('bulletFired', function(bullet){
    //detect collision
  });

});