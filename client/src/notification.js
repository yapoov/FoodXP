import api from "./api";

const publicVapidKey =
  "BKjvUKxPLiSbGVjsTP0cDEIKScjIbT11cnb23HoD8HiJjat9gGkdaEItf8WACo1jiOcPwBDyyi6YjVGlqQWxLaY";

export async function SetupNotification() {
  // Check for service worker
  if ("serviceWorker" in navigator) {
    await send().catch((err) => console.error(err));
  }
}

async function send() {
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("/serviceWorker.js", {
    scope: "/",
  });
  console.log("Service Worker Registered...");

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  await api.post("/notifications/subscribe", JSON.stringify(subscription));
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
