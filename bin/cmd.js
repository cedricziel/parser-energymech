#!/usr/bin/env node
var fs = require('fs');
var split = require('split');
var moment = require('moment');
var stdio = require('stdio');

var ops = stdio.getopt(
		{
			"day": {key: 'd', description: 'The day for the log-file', args: 1, mandatory: true},
			"month": {key: 'm', description: 'The month for the log-file', args: 1, mandatory: true},
			"year": {key: 'y', description: 'The ear for the log-file', args: 1, mandatory: true},
			"file": {key: 'f', description: 'The file to process', args: 1, mandatory: true}
		}
);

/**
 * Delimiters
 */
var NORMAL_LINE = /^\[[^\]]*(\d{2}):(\d{2}):(\d{2})] <([^>]+)> (.*)$/g;
var ACTION_LINE = /^\[[^\]]*(\d{2}):\d+:\d+\] \* (\S+) (.*)$/g;
var THIRD_LINE = /^\[[^\]]*(\d{2}):(\d+):\d+\] \*{3} (.+)$/g;

var jsonLines = [];

var iS = fs.createReadStream('fixtures/example.log', {
	encoding: 'utf8'
}).pipe(split());

iS.on('open', function () {
	console.log('File opened');
});

var match = '';
iS.on('data', function (data) {
	match = NORMAL_LINE.exec(data);
	if (match != null) {
		processNormalLine(match);
	}
	match = ACTION_LINE.exec(data);
	if (match != null) {
	}
	match = THIRD_LINE.exec(data);
	if (match != null) {
	}
});

iS.on('end', function () {
	console.log(jsonLines);
});

/**
 * Processes a normal line
 *
 * @param Array line
 */
var processNormalLine = function (line) {
	var json = {
		"date": createTimeStamp(line[1], line[2], line[3]).toString(),
		"nick": line[4].toString(),
		"text": line[5].toString()
	};
	jsonLines.push(json);
}

var createTimeStamp = function (hour, minute, second) {
	var compiledDate = moment().seconds(second)
			.minutes(minute)
			.hours(hour)
			.days(ops.day)
			.months(ops.month)
			.year(ops.year)
	return compiledDate
};