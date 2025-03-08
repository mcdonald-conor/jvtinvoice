# PWA Features for KM Joinery Quote Generator

This application has been configured as a Progressive Web App (PWA), which means it can be installed on your mobile device's home screen and used like a native app.

## Quick Test

To quickly test the PWA functionality, visit `/pwa-test.html` in your browser. This page provides instructions for installing the app on your device and verifies that the PWA features are working correctly.

## Installing on iPhone

1. Open the application in Safari browser
2. Tap the Share button (the square with an arrow pointing upward)
3. Scroll down and tap "Add to Home Screen"
4. Give the app a name (or keep the default) and tap "Add"
5. The app will now appear on your home screen with its icon

## Installing on Mac

1. Open the application in Safari
2. Click on "Safari" in the menu bar
3. Select "Add to Dock..."
4. Click "Add" in the dialog that appears

## Features

- **Offline Support**: The app can work offline once it has been loaded
- **Home Screen Icon**: Custom icon when added to your home screen
- **Full-Screen Experience**: When launched from the home screen, the app runs in full-screen mode without Safari's browser interface
- **Fast Loading**: The app caches resources for faster loading times
- **Splash Screens**: Custom splash screens for various iOS devices
- **Offline Page**: A dedicated offline page is shown when the app is offline

## Technical Details

The PWA implementation includes:

- Web App Manifest (`manifest.json`)
- Service Worker for offline caching
- Apple-specific meta tags for iOS support
- Custom icons in various sizes
- Splash screens for a native-like experience
- Offline fallback page

## Troubleshooting

If you encounter any issues with the PWA functionality:

1. Make sure you're using a supported browser (Safari on iOS, Chrome on Android)
2. Try clearing your browser cache and reloading the page
3. Ensure you have a stable internet connection when first loading the app
4. If the app doesn't update, try removing it from your home screen and reinstalling it
5. Check the browser console for any service worker registration errors

## Development

To modify the PWA features:

- Edit the `manifest.json` file in the `public` directory
- Update the service worker (`sw.js`) for different caching strategies
- Replace the icons in the `public/icons` directory with your own (maintaining the same sizes)
- Modify the splash screens in the `public/splash` directory
- Update the offline page in `public/offline.html`

## Testing PWA Features

1. Visit `/pwa-test.html` to test installation and offline functionality
2. Use browser developer tools to simulate offline mode
3. Check that the service worker is registered correctly in the browser's developer tools
4. Verify that the app can be installed to the home screen
5. Test that the app works offline after installation
