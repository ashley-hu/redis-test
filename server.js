const express = require('express');
const app = express();
const path = require("path");

const server = require('http').Server(app);
const io = require('socket.io')(server);

const redis = require('redis');
const socketRedis = require('socket.io-redis');

// adapter allows multiple socket.io nodes to broadcast + emit to each other
io.adapter(socketRedis({ host: 'localhost', port: 6379 }));

// serve static files from public
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// serve views files from views
app.set('views', path.join(__dirname, 'views'));
// set view engine as handlebars
app.set('view engine', 'hbs');

const pub = redis.createClient();
const sub = redis.createClient();

app.get('/', (req, res) => {
	res.render('cake');
});

io.on('connection', socket => {
	//console.log("connected: " + socket.id);
	socket.on('chat message', function(msg){
		//io.emit('chat message', msg);
		pub.publish('chat', JSON.stringify(msg)); 
	});
});

sub.subscribe('chat');
sub.on('message', function(channel, message){
	console.log("Channel: " + channel);
	io.emit('chat message', JSON.parse(message));
});

server.listen(3000);
