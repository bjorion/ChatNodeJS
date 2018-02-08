/*
 * DAVE - Digitally Advanced Vim Engine
 * (listen / send messages to the client)
 */
'use strict';

// --- global imports ---
/** HTTP server */
const http = require('http');
/** Utility for URL resolution and parsing */
const url = require('url');
/** Server-Sent Events */
const SSE = require('sse');
/** Events */
const EventEmitter = require('events');

// --- local imports ---
/** User object */
const User = require('./user');
/** Command Line */
const Cmd = require('./cmd');
/** Serve File */
const FileSystem = require('./file-system');

// --- global ---
const port = 8080;
const server = http.createServer();

/** Array of users */
const users = [];
const userDave = new User(null, null, "Dave");
users.push(userDave);

/** File System object */
const fs = new FileSystem();

/** Msg Dispatcher */
class MyEmitter extends EventEmitter {}
const msgDispatcher = new MyEmitter();

/** Command Line object */
const cmd = new Cmd(server, users, msgDispatcher);

/** new method that returns the object "equal" to 'other' */
Array.prototype.contains = function(other) 
{
	let found = this.find(elem => { 
		return (!elem.equals) ? elem === other : elem.equals(other);
	});
	return found;	
};

// --- Server Events ---
/**
 * @param req http.IncomingMessage
 * @param res http.ServerResponse
 */
server.on('request', (req, res) => 
{
	// debugHeaders(req);
	let method = req.method.toLowerCase();
	let ip = req.socket.remoteAddress;
	let remotePort = req.socket.remotePort;
	let resource = url.parse(req.url).pathname;
	
	// check user
	let newUser = new User(ip, remotePort);
	let user = users.contains(newUser);
	if (!user) {
		log('req: adding new user ' + newUser);
		users.push(newUser);
		user = newUser;
	}
	else {
		// log("req: known user " + user);
	}
	
	// POST
	let body = [];
 	req.on('data', (chunk) => {
 		body.push(chunk);
 	});
 	req.on('end', () => {
 		if (method === 'post') {
			body = Buffer.concat(body).toString();
			let text = body.substr(body.indexOf('=') + 1);
			text = decodeURIComponent(text).replace(/\+/g, ' ');
			msgDispatcher.emit('dispatch', user, text);
			let msg = '{ "status": "ok" }';
			res.writeHead(200,{
				'Content-Length': msg.length,
				'Content-Type': 'application/json',
			});
			res.end(msg);
		}
 	});
	
	let ok = false;
	// GET
	if (method === 'get') {
		resource = (resource === '/') ? '/index.html' : resource;
		let ext = resource.substr(resource.lastIndexOf('.') + 1);
		if (ext === 'html' || ext === 'css' || ext === 'js') {
			ok = fs.serveFile(res, resource, ext);
		}
		if (ext === 'ico') {
			ok = fs.serveResource(res, resource, ext);
		}
		if (!ok) {
			res.writeHead(200);
			res.end();
		}
	}
	
});

// event: close
server.on('close', function() 
{
	cmd.logp('Server is closed');
});

// --- SSE ---
const sse = new SSE(server);
sse.on('connection', function(client)
{
	let newUser = new User(client.req.socket.remoteAddress, client.req.socket.remotePort);
	// log("sse: connection with user " + newUser);
	
	let user = users.contains(newUser);
	if (user) {
		let isSet = !!user.sseClient;
		user.sseClient = client;
		if (!isSet) {
			log("sse: new connection with user " + user);
		}
		else {
			log("sse: already connected with user " + user);
		}
	}
	else {
		log("sse: user not found? " + newUser);
	}
});

// --- Message Dispatcher ---
msgDispatcher.on('dispatch', function(src, text) 
{
	log(src.nickname + " => " + text);
	let msg = { 
		"name": src.nickname,
		"text": text
	};
	for (let i = 0; i < users.length; i++) {
		let user = users[i];
		if (user.sseClient) {
			let content = JSON.stringify(msg);
			log("sse: send to " + user);
			user.sseClient.send(content);
		}
	}
	
});

// --- Misc methods ---
function log(msg) 
{
	console.log(msg);
}

function logIP(msg, r) 
{
	log(msg + ": local : " + r.socket.localAddress + "-" + r.socket.localPort);
	log(msg + ": remote: " + r.socket.remoteAddress + "-" + r.socket.remotePort);
}

// --- Start application ---
server.listen(port);
log('Server started on port ' + port);
log('Type .h for help');






	