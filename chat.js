var express     = require("express");
	application = express(),
	edge		= require("./node_modules/edge"),
	http 		= require('http').Server(application),
	io			= require('socket.io')(http),
	execute		= edge.func(require('path').join(__dirname, 'call_webservice.csx')),
	port		= process.env.PORT || 8080;

application.use(express.static(__dirname + '/'));

application.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	socket.on('message from me', function(msg){

		execute(msg, function(error, result){
			if(error) throw error;
			console.log(result);
		});

		socket.broadcast.emit('message', msg);
	});
});

http.listen(port, function(){
	console.log('listening on *:' +  port);
});