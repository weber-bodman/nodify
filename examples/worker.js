var clientId = null;
var port = null;
var url = "ws://localhost:8001";

var socket = new WebSocket(url);

var options = {
    icon: 'notification.png',
    timeout: 10
};

socket.onmessage = function(e) {
    console.log(e.data);
    options.body = e.data;
    var notification = new Notification('Test notification', options);
    /*
    // not working:
    notification.onclick = function(e) {
        console.log('clicked');
    };
    */
};

socket.onopen = function() {
    socket.send(clientId);
};

self.addEventListener("connect", function(e) {
    port = e.ports[0];
    port.onmessage = function(e) {
        var id = e.data;
        if(id && clientId != id) {
            clientId = id;
        }
    };
});
