var express = require('express'),
	app = express(),
	http = require('http').createServer(app),
	socket = require('socket.io')(http),
	Moniker = require('moniker'),
	Room = require('./lib/room.js'),

	uuid = require('node-uuid');

app.set('port', (process.env.PORT || 5000))
app.set("view options", {layout: false});
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));

function errorHandler(err, req, res, next) {
	res.status(500);
	res.render('error', { error: err });
}
app.use(errorHandler);



//-------- ACTIONS ----------------
function getColor() {
	return '#'+Math.floor(Math.random()*8777215).toString(16);
}

var names = Moniker.generator([Moniker.adjective, Moniker.verb, Moniker.noun], { glue: ' ' });
var people = [];
var rooms = [];
var clients = [];
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

app.get('/', function (req, res) {
	res.render('index.html');
})

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
		client.emit("update", people[client.id], " has connected to the server.");
		socket.sockets.emit("update", people[client.id], " is online.");
		socket.sockets.emit("update people", people);
		clients.push(client);
	});

	client.on("chat message", function(msg) {  
		console.log("CHAT");
		var user = people[client.id];
		socket.sockets.in(user.room).emit("chat message", user, msg);
	});

	client.on("disconnect", function() {  
		if (people[client.id]) {
			if (people[client.id].inroom === null) {
			socket.sockets.emit("update", people[client.id].name + " has left the chat.");
			delete people[client.id];
			socket.sockets.emit("update people", people);
		} else {
			socket.sockets.emit("update", people[client.id].name + " has left the chat.");
			delete people[client.id];
			socket.sockets.emit("update people", people);
		}
	}
  });
});


//-------- START ----------------
var server = http.listen(app.get('port'), function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App is listening at http://%s:%s', host, port)
});