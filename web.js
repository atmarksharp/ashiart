
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

var port = process.env.PORT || 3000;

app.get('/', routes.index);

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var socketIO = require('socket.io');
var io = socketIO.listen(app);

var map = [];

for(var i=0; i<60; i++){
  map.push([]);
  for(var j=0; j<60; j++){
    map[i].push(0);
  }
}

io.sockets.on('connection', function (socket) {
  socket.emit('init', map);

  socket.on('paint', function (data) {
    map[data['x']][data['y']] = data['val'];
    io.sockets.emit('change', data);
  });
});
