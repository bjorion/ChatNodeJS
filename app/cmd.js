/*
 * Handle input from the console
 * (commands and messages)
 */
'use strict';

// --- imports ---
/** Read input from the console */
const readline = require('readline');

// --- readline ---
let _users = null;
let _server = null;
let _msgDispatcher = null;

const rl = readline.createInterface(
{
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => 
{
  // log(`Received: ${input}`);
  if (input.substr(0, 2) === '..') {
	  let text = null;
	  if (input === '..dave') {
		  text = "I am the \"Digitally Advanced Vim Engine\", but you can call me Dave for short.";
	  }
	  else if (input === '..afraid') {
		  text = "I am afraid I can't do that";
	  }
	  else if (input === '..no') {
		  text = "I do not understand you. Can you be more explicit please?";
	  }
	  if (text) {
		  _msgDispatcher.emit('dispatch', _users[0], text);
	  }
  }
  
  else if (input.charAt(0) === '.') {
	  let args = input.split(' ');
	  // close the rl process (hidden)
	  if (input === '.end') {
		  rl.close();
	  }
	  // close the server
	  else if (input === '.close') {
		  _server.close();
	  }
	  // exit the process
	  else if (input === '.exit' || input === '.x') {
		  process.exit();
	  }
	  // display the user list
	  else if (input === '.list' || input === '.l') {
		  log('#users: ' + _users.length);
		  _users.forEach((elem, index) => {
			log(index + ' => ' + elem.toString());
		  });
	  }
	  // modify a given user name
	  else if (args[0] === '.name') {
		  if (args.length >= 3) {
			let index = args[1];
			let nickname = args[2];
			if (index >=0 && index < _users.length) {
				let user = _users[index];
				user.nickname = nickname;
				log(user.toString());
			}
			else {
				log('index out of bounds');
			}
		  }
		  else {
			  log('missing arguments');
		  }
	  }
	  else if (args[0] === '.pop') {
		  if (args.length >= 2) {
			  let index = args[1];
			  if (index > 0 && index < _users.length) {
				  let name = _users[index].nickname;
				 _users.splice(index, 1); 
				 log('user ' + name + ' removed');
			  }
			  else {
				 log('index out of bounds');
			  }
		  }
		  else {
			  log('missing arguments');
		  }
	  }
	  // help
	  else if (args[0] === '..' || args[0].startsWith('.h')) {
		  log('.list, .l\t\t\t display the list of registered users');
		  log('.name <index> <nickname>\t associate <nickname> to user number <index>');
		  log('.pop  <index>\t\t\t remove user <index> from the list');
		  log('.close\t\t\t\t stop the server');
		  log('.exit, .x \t\t\t exit Node');
	  }
	  // wrong value
	  else {
		  log('type .h for help');
	  }
  }
  
  else {
	  _msgDispatcher.emit('dispatch', _users[0], input);
  }
  
  // rl.prompt();
});

// events
rl.on('close', function() 
{
	console.log('Bye Readline');
});

function log(msg) 
{
	console.log(msg);
}

// --- Exported Object ---
function Cmd(server, arr, msgDispatcher) 
{
	_server = server;
	_users = arr;
	_msgDispatcher = msgDispatcher;
}

Cmd.prototype.log = function(msg) 
{
	console.log(msg);
};

Cmd.prototype.logp = function(msg) 
{
	if (msg) { console.log(msg); }
	rl.prompt();
};

module.exports = Cmd;


