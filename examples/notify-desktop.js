var socket = new WebSocket("ws://localhost:8001");

socket.onopen = function(evt) { 
    console.log("Socket opened");
    socket.send("42");
};
socket.onclose = function(evt) {console.log("Socket closed");};
socket.onmessage = function(evt){doNotification(evt.data);};
socket.onerror = function(evt) {console.log("Error: " + evt.data);};

// ===

/*
// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe() {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Notification title', {
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: "Hey there! You've been notified!",
    });

    notification.onclick = function () {
      window.open("http://stackoverflow.com/a/13328397/1269037");      
    };

  }

}

notifyMe();

*/

// Using notify.js

if (!Notify.needsPermission) {
    //doNotification();
} else if (Notify.isSupported()) {
    Notify.requestPermission(onPermissionGranted, onPermissionDenied);
}

function onPermissionGranted() {
	console.log('Permission has been granted by the user');
	//doNotification();
}

function onPermissionDenied() {
	console.warn('Permission has been denied by the user');
}

// ---

function onNotifyShow() {
	console.log('Notification was shown!');
}

function doNotification(payload) {
    var myNotification = new Notify('Yo dawg!', {
        body: 'Payload: ' + payload,
        notifyShow: onNotifyShow
    });
    myNotification.show();
}
