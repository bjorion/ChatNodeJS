/*
 * Encapsulate information relating to a User
 */
'use strict';

// --- User object ---
function User(ip, port, nickname) 
{
	this.address = ip;
	this.port = port;
	this.nickname = (nickname) ? nickname : '?';
	this.sseClient = null;
}

User.prototype.equals = function(other) 
{
	return this.address === other.address;
};

User.prototype.toString = function() 
{
	let address = (this.sseClient) ? this.sseClient.req.socket.remoteAddress : null;
	let port = (this.sseClient) ? this.sseClient.req.socket.remotePort : null;
	return "[" + this.nickname + ", " + this.address + "-" + this.port + ", sse: " + address + "-" + port + "]";
};

module.exports = User;

