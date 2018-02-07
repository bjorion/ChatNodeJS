/*
 * Class used to read files locally and to serve them to the client
 */
'use strict';

// --- global imports ---
/** Read local files */
const fs = require('fs'); 

// --- Constants ---
const MIMES = new Map();
MIMES.set("html", "text/html");
MIMES.set("css", "text/css");
MIMES.set("js"," text/javascript");
MIMES.set("ico", "image/x-icon");

// --- Exported Object ---
function FileSystem()
{}

/**
 * Serve text files.
 *
 * @param res http.ServerResponse
 * @param filename the file to read
 * @param ext the file extension (used to set the MIME type in the response)
 */
FileSystem.prototype.serveFile = function(res, filename, ext)
{
	filename = './app/' + filename;
	// console.log('looking for file: ' + filename);
	
    let stream = fs.createReadStream(filename);
    res.writeHead(200, { "Content-Type": MIMES.get(ext) });
    
    stream.on('readable', function() {
        let data = stream.read();
		if (data) {
			if (typeof data === 'string') {
				res.write(data);
			}
			else if (typeof data === 'object' && data instanceof Buffer) {
				res.write(data.toString('utf8'));
			}
		}
    });
    stream.on('end', function() {
        res.end();
    });
	return true;
};

// Currently only serves ico files
/**
 * Serve binary files.
 *
 * @param res http.ServerResponse
 * @param filename the file to read
 * @param ext the file extension (used to set the MIME type in the response)
 */
FileSystem.prototype.serveResource = function(res, filename, ext)
{
	filename = './app/' + filename;
	// console.log('looking for resource: ' + filename);
	
	if (!filename.endsWith('.ico')) {
		return false;
	}
	
	res.setHeader('Content-Type', MIMES.get(ext));
	fs.createReadStream(filename).pipe(res);
	
	return true;
};

module.exports = FileSystem;
