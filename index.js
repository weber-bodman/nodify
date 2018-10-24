var ws = require("nodejs-websocket");

var clients = [];
 
var wsServer = ws.createServer(function (conn) {
    var clientId = '';
    conn.on("text", function (str) {
        clientId = str;
        clients[clientId] = conn;
        console.log("Client registered: " + clientId)
    });
    conn.on("close", function (code, reason) {
        var index = clients.indexOf(clientId);
        if (index > -1) {
            clients.splice(index, 1);
        }
        console.log("Client released: " + clientId)
    });
    conn.on("error", function (code, reason) {
        var index = clients.indexOf(clientId);
        if (index > -1) {
            clients.splice(index, 1);
        }
        console.log("Client error: " + clientId)
    });
}).listen(8001);

var url = require('url');
var http = require('http');

var httpServer = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});

  var params = url.parse(request.url, true);
  params.timestamp = new Date().getTime();

  //console.log(request.url);

  if(params.query && "client" in params.query) {
    var clientId = params.query.client;

    if(clients[clientId] && clients[clientId].readyState == clients[clientId].OPEN) {
        clients[clientId].sendText(JSON.stringify(params));
        console.log("Client nodified: " + clientId);
        response.write("Client nodified: " + clientId + "\n");
    }
  }

  response.end("Done \n");
});

httpServer.listen(8002);
