var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
var Game = require('/Users/user/Documents/html/tictactoe/public/game.js');
var path = require('path');

server.listen(3000);

app.get('/', function(req,res) {
	res.sendfile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

var game = new Game();
game.initialize(io);