Notification.requestPermission();

var worker = new SharedWorker('worker.js');
//worker.port.start();
worker.port.postMessage(42);
