// TODO: currently only one client connection is possible with the same id...
// ...use an array of arrays to allow multiple connections instead...?

var url = require('url');
var http = require('http');

var WebSocketServer = require('websocket').server;

var clients = [];

var hs = http.createServer().listen(8001);

var wsServer = new WebSocketServer({ httpServer: hs, autoAcceptConnections: true });

wsServer.on('connect', function connection(conn) {
    console.log("New connection");
    conn.sendUTF('ACK!');
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
        console.log("Connection released (" + code + ', ' + reason + "): " + clientId);
    });
    conn.on("error", function (code, reason) {
        var index = clients.indexOf(clientId);
        if (index > -1) {
            clients.splice(index, 1);
        }
        console.log("Connection error (" + code + ', ' + reason + "): " + clientId);
    });
});

var httpServer = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});

  var params = url.parse(request.url, true);
  params.timestamp = new Date().getTime();

  if(params.query && "client" in params.query) {
    var clientId = params.query.client;

    if(clients[clientId] && clients[clientId].readyState == clients[clientId].OPEN) {
        clients[clientId].sendUTF(params.query.payload);
        console.log("Client nodified: " + clientId);
        response.write("Client nodified: " + clientId + "\n");
    }
  }

  response.end("Done \n");
});

httpServer.listen(8002);
