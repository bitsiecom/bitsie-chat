var express = require('express'),
	app = express(),
	http = require('http').createServer(app),
	io = require('socket.io')(http);

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
app.get('/', function (req, res) {
 	res.render('index.html');
})

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
    	io.emit('chat message', msg);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});


//-------- START ----------------
var server = http.listen(app.get('port'), function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App is listening at http://%s:%s', host, port)
});