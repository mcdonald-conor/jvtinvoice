// This script registers a service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('ServiceWorker registration successful with scope:', registration.scope);
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });
}
