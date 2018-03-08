var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var drawingPortal = require('./routes/drawingPortal');

var app = express();


var http = require('http').Server(app);
var io = require('socket.io')(http);

var allusers = [];
var allsocketobjects = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);
app.use('/drawing', drawingPortal);


app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


io.sockets.on('connection', function (socket) {

  socket.on('ping', function (data) {

    console.log('socket: server recieves ping (2)');

    io.sockets.emit('pong', data);

    console.log('socket: server sends pong to all (3)');

  });

  socket.on('drawLine', function (data) {
    socket.broadcast.emit('drawLine', data);
  });

  socket.on('drawRect', function (data) {
    socket.broadcast.emit('drawRect', data);
  });

  socket.on('drawCir', function (data) {
    socket.broadcast.emit('drawCir', data);
  });

  socket.on('drawTri', function (data) {
    socket.broadcast.emit('drawTri', data);
  });


  socket.on('drawBrushs', function (path) {
    socket.broadcast.emit('drawBrushs', path);
  });


  socket.on('drawPens', function (path) {
    socket.broadcast.emit('drawPens', path);
  });


  socket.on('chat message', function (msg) {
    console.log('chat message');
    io.emit('chat message', socket.username, msg);
  });


  socket.on('username', function (user) {
    socket.username = user;
    console.log('username');
    allusers.push(socket.username);
    allsocketobjects.push(socket);
    console.log('allusers', allusers);
    console.log('allsocketobjects', allsocketobjects);
    io.emit('allusers', allusers);
    socket.emit('username', "Hi " + user + "! You are connected!");
    socket.broadcast.emit('guest connected', user + " has entered the chat room");
  });

  socket.on('private_request', function (sender, receiver) {
    console.log('private request', receiver);
    var receiver_id;
    for (var i = 0; i < allusers.length; i++) {
      if (allsocketobjects[i].username == receiver) {
        receiver_id = allsocketobjects[i].id;
      }
    }
    socket.broadcast.to(receiver_id).emit('private_request_received', this.username , " wants to draw with you. Click to start drawing together! ");
  });

  socket.on('joined room', function (username,receiver) {
    var receiver_id;
    for (var i = 0; i < allusers.length; i++) {
      if (allsocketobjects[i].username == receiver) {
        receiver_id = allsocketobjects[i].id;
      }
    }
    socket.broadcast.to(receiver_id).emit('join drawing',username);
  });


  socket.on('disconnect', function () {
    console.log('disconnect');
    if (socket.username == undefined) {} else {
      var name = socket.username;
      socket.broadcast.emit('guest disconnected', name + " has left the chat room");
      var index = allusers.indexOf(name);
      if (index > -1) {
        allusers.splice(index, 1);
        allsocketobjects.splice(index, 1);
      }
      io.emit('allusers', allusers);
    }
  });

});


module.exports = {
  app: app,
  http: http
}