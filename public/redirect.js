// This script helps with browser compatibility
(function() {
  // Check if we're on desktop
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Get the current URL
  const currentUrl = window.location.href;

  // If we're on desktop and not already redirected
  if (!isMobile && !currentUrl.includes('nocache')) {
    // Add a cache-busting parameter
    const redirectUrl = currentUrl + (currentUrl.includes('?') ? '&' : '?') + 'nocache=' + new Date().getTime();

    // Redirect to the new URL
    window.location.href = redirectUrl;
  }
})();
