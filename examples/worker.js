var clientId = null;
var url = "ws://localhost:8001";

var options = {
    //badge: '',
    icon: 'notification.png',
    //image: 'notification.png',
    timeout: 10,
    data: 'https://www.google.com?q='
};

var socket = new WebSocket(url);
socket.onmessage = function(evt) {
    options.body = evt.data;
    var notification = new Notification('title', options);
    notification.onclick = function(e) {console.log('clicked');};
};
socket.onopen = function() {
    socket.send(clientId);  
};

self.addEventListener("connect", function(e) {
    var port = e.ports[0];
    port.onmessage = function(e) {
        var id = e.data;
        if(id && clientId != id) {
            clientId = id;
        }
    };
    port.start();
});

self.addEventListener('notificationclick', function(event) {  
  console.log('On notification click: ', event.notification.tag);  
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146  
  //event.notification.close();

  // This looks to see if the current is already open and  
  // focuses if it is  
  event.waitUntil(
    clients.matchAll({  
      type: "window"  
    })
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/' && 'focus' in client)  
          return client.focus();  
      }  
      if (clients.openWindow) {
        return clients.openWindow('https://www.google.de');  
      }
    })
  );
});
