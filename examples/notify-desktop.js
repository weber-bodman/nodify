Notification.requestPermission();

var options = {
    //badge: '',
    icon: 'notification.png',
    //image: 'notification.png',
    timeout: 10,
    //data: 'https://www.google.com?q='
};

var socket = new WebSocket("ws://localhost:8001");

socket.onopen = function(evt) { 
    console.log("Socket opened");
    socket.send("42");
};
socket.onclose = function(evt) {console.log("Socket closed");};
socket.onmessage = function(evt){
    console.log("Message received");
    options.body = evt.data;
    var notification = new Notification('title', options);
        notification.onclick = function(e) {console.log('clicked');};
    };
socket.onerror = function(evt) {console.log("Error: " + evt.data);};
