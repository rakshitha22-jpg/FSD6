// public/sw.js

// 1. Listen for background push events
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Message Received.');
  
  // Default payload in case the server sends an empty ping
  let pushData = {
    title: '🎉 Flash Deal!',
    body: 'A new deal just dropped. Click to view.',
    image: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png'
  };
  
  // 2. Extract the JSON payload sent from the server
  if (event.data) {
    try {
      pushData = event.data.json();
    } catch (e) {
      pushData.body = event.data.text();
    }
  }
  
  // 3. Configure how the system notification looks
  const options = {
    body: pushData.body,
    icon: pushData.image,
    badge: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png', // Android status bar icon
    data: { url: 'http://localhost:5174' } // Where to go when clicked
  };
  
  // 4. Instruct the OS to show the notification
  event.waitUntil(
    self.registration.showNotification(pushData.title, options)
  );
});

// 5. Handle the user clicking the notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Dismiss the alert
  
  // Open the app in a new browser tab
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
