/*jslint node: true */
"use strict";

var fs = require('fs');
var util = require('util');
var conf = require('./conf.js');
var desktopApp = require('./desktop_app.js' + '');

var appDataDir = desktopApp.getAppDataDir();
var log_filename = conf.LOG_FILENAME || (appDataDir + '/' + 'log.txt');
var log_level = conf.LOG_LEVEL || 70;
var log_level_co = conf.LOG_LEVEL_CO || "<=";



// Check dir exists
if (!fs.existsSync(appDataDir)) {
	fs.mkdirSync(appDataDir);
}

fs.writeFileSync(log_filename, '');
var writeStream = fs.createWriteStream(log_filename);

function compare(post, operator, value) {
	  switch (operator) {
	    case '>':   return post > value;
	    case '<':   return post < value;
	    case '>=':  return post >= value;
	    case '<=':  return post <= value;
	    case '==':  return post == value;
	    case '!=':  return post != value;
	    case '===': return post === value;
	    case '!==': return post !== value;
	  }
	}

function printlog(error_level, bgcolor, fgcolor, symbol, message, data, cb) {

	var args = Array.prototype.slice.call(arguments);
	var log = {};

	if (message instanceof Error) {
		log.message = message.stack;
	} else {
		log.message = message;
	}

	if (data && util.isObject(data)) {
		try {
			log.data = JSON.stringify(data);
		} catch (e) {
			// TODO: handle exception
		}		
	} else {
		log.data = data;
	}

	
	log.symbol = symbol;

	// Write Log File?
	if (compare(error_level, "<=", log_level_file) && writeStream) {
		if (log.data) {
			writeStream.write(util.format('[%s] %s : %s - %s\n', log.symbol,
					Date().toString(), log.message, log.data));
		} else {
			writeStream.write(util.format('[%s] %s : %s\n', log.symbol, Date()
					.toString(), log.message));
		}
	}

	// write Log
	if (compare(error_level, log_level_co, log_level)) {
		if (log.data) {
			console.log(bgcolor + '[%s] %s: %s - %s' + fgcolor, symbol, Date()
				.toString(), log.message, log.data);				
		} else {
			console.log(bgcolor + '[%s] %s: %s' + fgcolor, symbol, Date()
				.toString(), log.message);
		}
	}
	return cb;
}

function trace(message, data) {
	printlog(10, "\x1b[40m", "\x1b[37m", "TRC", message, data);
}

function info(message, data) {
	printlog(20, "\x1b[40m", "\x1b[33m", "INF", message, data);
}

function warn(message, data) {
	printlog(30, "\x1b[40m", "\x1b[35m", "WRN", message, data);
}

function error(message, data) {
	printlog(40, "\x1b[40m", "\x1b[36m", "ERR", message, data);
}

function fatal(message, data) {
	printlog(50, "\x1b[40m", "\x1b[31m", "FTL", message, data);
}

function log(message, data) {
	printlog(60, "\x1b[40m", "\x1b[37m", "LOG", message, data);
}

function debug(message, data) {
	printlog(90, "\x1b[40m", "\x1b[32m", "DBG", message, data);
}
/*
 * 
 * console.log('\x1b[36m%s\x1b[0m', info); //cyan
 * console.log('\x1b[33m%s\x1b[0m: ', path); //yellow
 * 
 * Reset = "\x1b[0m" Bright = "\x1b[1m" Dim = "\x1b[2m" Underscore = "\x1b[4m"
 * Blink = "\x1b[5m" Reverse = "\x1b[7m" Hidden = "\x1b[8m"
 * 
 * FgBlack = "\x1b[30m" FgRed = "\x1b[31m" FgGreen = "\x1b[32m" FgYellow =
 * "\x1b[33m" FgBlue = "\x1b[34m" FgMagenta = "\x1b[35m" FgCyan = "\x1b[36m"
 * FgWhite = "\x1b[37m"
 * 
 * BgBlack = "\x1b[40m" BgRed = "\x1b[41m" BgGreen = "\x1b[42m" BgYellow =
 * "\x1b[43m" BgBlue = "\x1b[44m" BgMagenta = "\x1b[45m" BgCyan = "\x1b[46m"
 * BgWhite = "\x1b[47m"
 * 
 */

exports.trace = trace;
exports.debug = debug;
exports.log = log;
exports.info = info;
exports.warn = warn;
exports.error = error;
exports.fatal = fatal;