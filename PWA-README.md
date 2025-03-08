# PWA Features for KM Joinery Quote Generator

This application has been configured as a Progressive Web App (PWA), which means it can be installed on your mobile device's home screen and used like a native app.

## Installing on iPhone

1. Open the application in Safari browser
2. Tap the Share button (the square with an arrow pointing upward)
3. Scroll down and tap "Add to Home Screen"
4. Give the app a name (or keep the default) and tap "Add"
5. The app will now appear on your home screen with its icon

## Features

- **Offline Support**: The app can work offline once it has been loaded
- **Home Screen Icon**: Custom icon when added to your home screen
- **Full-Screen Experience**: When launched from the home screen, the app runs in full-screen mode without Safari's browser interface
- **Fast Loading**: The app caches resources for faster loading times

## Technical Details

The PWA implementation includes:

- Web App Manifest (`manifest.json`)
- Service Worker for offline caching
- Apple-specific meta tags for iOS support
- Custom icons in various sizes
- Splash screen for a native-like experience

## Troubleshooting

If you encounter any issues with the PWA functionality:

1. Make sure you're using a supported browser (Safari on iOS, Chrome on Android)
2. Try clearing your browser cache and reloading the page
3. Ensure you have a stable internet connection when first loading the app
4. If the app doesn't update, try removing it from your home screen and reinstalling it

## Development

To modify the PWA features:

- Edit the `manifest.json` file in the `public` directory
- Update the service worker (`sw.js`) for different caching strategies
- Replace the icons in the `public/icons` directory with your own (maintaining the same sizes)
- Modify the splash screen in `public/splash.html`
