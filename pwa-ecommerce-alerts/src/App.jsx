import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [permission, setPermission] = useState(Notification.permission);
  const [product, setProduct] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Capture the install prompt event
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the browser's install prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User installed the PWA');
      }
      setDeferredPrompt(null); // We can only use the prompt once
    }
  };

  // Function to ask the user for permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    const status = await Notification.requestPermission();
    setPermission(status);
  };

  // Function to simulate fetching a product in-app
  const fetchSampleProduct = async () => {
    try {
      const res = await fetch('https://fakestoreapi.com/products/1');
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1>🔔 PWA Deal Alerts</h1>

      {/* --- INSTALL APP BUTTON --- */}
      {deferredPrompt && (
        <div style={{ padding: '15px', background: '#e0f7fa', borderRadius: '8px', marginBottom: '20px' }}>
          <p>Get the best experience by installing our app!</p>
          <button
            onClick={handleInstallClick}
            style={{
              padding: '10px',
              background: '#00838f',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            📲 Install App
          </button>
        </div>
      )}

      {/* --- NOTIFICATION PERMISSION STATUS --- */}
      <div style={{ padding: '15px', background: '#f4f4f4', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Push Permission Status:</strong> {permission}</p>
        {permission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            style={{
              padding: '10px',
              background: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🔔 Enable Background Alerts
          </button>
        )}
      </div>

      {/* --- FETCH SAMPLE PRODUCT --- */}
      <button
        onClick={fetchSampleProduct}
        style={{
          padding: '10px 15px',
          cursor: 'pointer',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        🛍️ Fetch App Data (Standard API Call)
      </button>

      {/* --- DISPLAY FETCHED PRODUCT --- */}
      {product && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>{product.title}</h3>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <img
            src={product.image}
            alt={product.title}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }}
          />
        </div>
      )}

      {/* --- TESTING INSTRUCTIONS --- */}
      <div style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', borderRadius: '8px', fontSize: '14px' }}>
        <h4>📋 Testing Instructions:</h4>
        <ol>
          <li>Click "Enable Background Alerts" and allow notifications</li>
          <li>Open DevTools (F12) → Application tab</li>
          <li>Click "Service Workers" on the left sidebar</li>
          <li>Find the "Push" text box and paste this JSON:
            <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
{JSON.stringify({
  "title": "🚀 50% OFF Flash Sale!",
  "body": "Wireless Headphones are now only $49.99. Click to buy!",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
}, null, 2)}
            </pre>
          </li>
          <li>Click the Push button to simulate a server notification</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
