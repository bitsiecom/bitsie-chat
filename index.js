var express = require('express'),
	app = express(),
	http = require('http').createServer(app),
	socket = require('socket.io')(http),
	Moniker = require('moniker'),
	path = require('path'),
	Room = require('./lib/room.js'),
	uuid = require('node-uuid'),
	mongoose = require('mongoose'),
	env = process.env.NODE_ENV || 'development';

app.set('port', (process.env.PORT || 5000))
app.set("view options", {layout: false});
app.set('views', __dirname + '/public');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

 var forceSsl = function (req, res, next) {
 	console.log("ROCE SSSL");
	if (req.headers['x-forwarded-proto'] !== 'https') {
 	console.log("REDIRECTION SSSL");
		return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	return next();
 };

if (env === 'production') {
	app.use(forceSsl);
} else {
	console.log(env);
}

function errorHandler(err, req, res, next) {
	res.status(500);
	res.render('error', { error: err });
}
app.use(errorHandler);
app.get('/register', function (req, res) {
	res.sendFile(__dirname + '/public/views/register.html');
});

//-------- MONGO ------------------

require('./models/Users');
mongoose.connect('mongodb://localhost/users');

//-------- ACTIONS ----------------

var names = Moniker.generator([Moniker.adjective, Moniker.verb, Moniker.noun], { glue: ' ' });
var people = {};
var rooms = [];
var clients = [];

function getColor() {

	var H = Math.floor(Math.random()*255).toString();
	var S = Math.floor(Math.random()*50) + 50;
	var L = Math.floor((Math.random()*20) + (Math.random()*50)) ;

	if(L < 20) L = L + 30;
	var a = 1;

	return "hsla(" + H + "," + S + "%," + L + "%," + a + ")";
}

function getPeopleInRoom(roomId) {
	var roomPeople = {};
	for(var p in people) {
		if (people[p].room == roomId) roomPeople[p] = people[p];
	}
	return roomPeople;
}

Array.prototype.contains = function(k, callback) {  
    var self = this;
	return (function check(i) {
		if (i >= self.length) {
			return callback(false);
		}
		if (self[i] === k) {
			return callback(true);
		}
		return process.nextTick(check.bind(null, i+1));
	}(0));
};

app.get('/:id?', function (req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});
socket.on('connection', function(client) {

	// user has connected, give them a name
	//var username = names.choose();
	//io.emit('chat message', username + ' has connected.');

	client.on("join", function(roomId) {

		if (roomId == undefined) {
			roomId = uuid.v4();
		}

		var name = names.choose();

		people[client.id] = {
			"name" : name, 
			"room" : roomId,
			"color" : getColor()
		};

		var room = rooms[roomId];
		if (room != null) {
			// room exists
			client.join(roomId); //auto-join the creator to the room
			room.addPerson(client.id); //also add the person to the room object
			people[client.id].room = roomId; //update the room key with the ID of the created room
		} else {
			// room does not exist
			var room = new Room(roomId);
			rooms[roomId] = room;
			client.join(roomId); //auto-join the creator to the room
			room.addPerson(client.id); //also add the person to the room object
			people[client.id].room = roomId; //update the room key with the ID of the created room
		}
		var host = server.address().address;
		var port = server.address().port;

		var roomPeople = getPeopleInRoom(roomId)
		socket.sockets.in(roomId).emit("update people", roomPeople);
		socket.sockets.in(roomId).emit("start name", name);
		clients.push(client);
	});

	client.on("chat message", function(msg) {  
		var user = people[client.id];
		socket.sockets.in(user.room).emit("chat message", user, msg);
	});

	client.on("update username", function(username){

		if (username != ''){
			people[client.id].name = username;	
		};

		var roomId = people[client.id].room;
		var roomPeople = getPeopleInRoom(roomId)
		socket.sockets.in(roomId).emit("update people", roomPeople);
		socket.sockets.in(roomId).emit("update", people[client.id], " is online.");
	});

	client.on("disconnect", function() {  
		if (people[client.id] == null) return;
		var roomId = people[client.id].room;

		socket.sockets.in(people[client.id].room).emit("update", people[client.id], " has left the chat.");
		delete people[client.id];

		var roomPeople = getPeopleInRoom(roomId)
		socket.sockets.in(roomId).emit("update people", roomPeople);

	});
});


//-------- START ----------------
var server = http.listen(app.get('port'), function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App is listening at http://%s:%s', host, port)
});

