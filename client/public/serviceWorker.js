console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon ? data.icon : "/foodxp_logo.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
  });
});
