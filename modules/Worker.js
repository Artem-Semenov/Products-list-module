(function workerFN() {
  console.log("starting worker");
  function onmessage(e) {
    switch (e.data.name) {
      case "notification":
        console.log("Notification:");
        const img =
          "https://static.vecteezy.com/system/resources/previews/006/086/198/original/notification-icon-for-web-vector.jpg";
        const text = `Hi there!`;
        setTimeout(() => {
          let notification = new Notification("To do list", {
            body: text,
            icon: img,
          });
        }, 3000);
        break;
      default:
        console.error("Unknown message:", error);
    }
  }
  self.onconnect = function (e) {
    for (var i = 0, l = e.ports.length; i < l; i++) {
      e.ports[i].addEventListener("message", onmessage);
      e.ports[i].start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
    }
  };
})();
