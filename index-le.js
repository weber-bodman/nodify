// see: https://www.npmjs.com/package/websocket

//var ws = require("nodejs-websocket");

const url = require('url');
const http = require('http');
const https = require('https');
const fs = require('fs');

//const WebSocketServer = require('ws').Server;
var WebSocketServer = require('websocket').server;

// Certificate
const privateKey = fs.readFileSync('/home/maxi/dehydrated/certs/inmax.weber-bodman.de/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/home/maxi/dehydrated/certs/inmax.weber-bodman.de/cert.pem', 'utf8');
const ca = fs.readFileSync('/home/maxi/dehydrated/certs/inmax.weber-bodman.de/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	//ca: ca
};

var clients = [];

const httpsServer = https.createServer(credentials);

const wss = new WebSocketServer({ httpServer: httpsServer, autoAcceptConnections: true });

// CTI GUI

wss.on('connect', function connection(conn) {
    var clientId = '';
    conn.on("message", function (msg) {
        clientId = msg.utf8Data;
        clients[clientId] = conn;
        console.log("Client registered: " + clientId)
    });
    conn.on("close", function (code, reason) {
        var index = clients.indexOf(clientId);
        if (index > -1) {
            clients.splice(index, 1);
        }
        console.log("Client released (" + code + ', ' + reason + "): " + clientId)
    });
    conn.on("error", function (code, reason) {
        var index = clients.indexOf(clientId);
        if (index > -1) {
            clients.splice(index, 1);
        }
        console.log("Client error (" + code + ', ' + reason + "): " + clientId)
    });
});

httpsServer.listen(8001, function() {
    console.log((new Date()) + ' Server is listening on port 8001');
});

// Webhooks

var httpServer = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});

  var params = url.parse(request.url, true);
  params.timestamp = new Date().getTime();

  //console.log(request.url);

  if(params.query && "client" in params.query) {
    var clientId = params.query.client;

    if(clients[clientId] && clients[clientId].readyState == clients[clientId].OPEN) {
        clients[clientId].sendUTF(JSON.stringify(params));
        console.log("Client nodified: " + clientId);
        response.write("Client nodified: " + clientId + "\n");
    } else {
	console.log("Client not available: " + clientId);
    }
  }

  response.end("Done \n");
});

httpServer.listen(8002);

