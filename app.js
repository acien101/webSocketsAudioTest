
/**
 * Module dependencies
 */

var express = require('express');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const http = require('http');
//var mic = require('mic-stream');
var speaker = require('audio-speaker');
var webSocket = require('ws');
var spawn = require('child_process').spawn
var app = express();

/**
 * Configuration
 */

// all environments
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());



app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

var server = http.createServer(app);
const wss = new webSocket.Server({ server : server });

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});

//app.listen(8003);


////////////////////////////////////////


//var wss = new webSocket.Server({port: 8003});

/*

*/

var stream = nodeMicStream();

wss.on('connection', function connection(ws) {
    var connected = true;
    console.log("a");

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('close', function(connection) {
        console.log("close?!");
        //stream.pause();
        ws.close();
        connected = false;
    });

    stream.on('data', function (data) {
        try{
            if(connected)
                ws.send(data);
        }
        catch(err) {
            console.log(err.message);
        }
    });
});


function nodeMicStream () {
    var args = '-c 1 -r 44100 -f FLOAT_LE --buffer-size=16384'.split(' ');
    return spawn('arecord', args).stdout
}
