var socket = new WebSocket("ws://localhost:8001");

socket.onopen = function(evt) { 
    console.log("Socket opened");
    socket.send("42");
};
socket.onclose = function(evt) {console.log("Socket closed");};
socket.onmessage = function(evt){console.log(evt.data);};
socket.onerror = function(evt) {console.log("Error: " + evt.data);};
