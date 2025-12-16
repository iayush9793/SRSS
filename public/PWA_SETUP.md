# PWA Setup Instructions

## Icon Files Required

You need to create proper icon files for the PWA:

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

You can:
- Use an online icon generator
- Create them using design tools
- Use the university logo and resize it

Place these files in the `/public` directory.

## Service Worker

The service worker (`/public/sw.js`) is automatically registered when the app loads. It caches pages for offline access.

## Manifest

The manifest file (`/public/manifest.json`) is configured with:
- App name and description
- Theme colors
- Icons
- Shortcuts to Programs and Contact pages

## Testing PWA

1. Build the app: `npm run build`
2. Start the production server: `npm start`
3. Open in Chrome/Edge
4. Open DevTools > Application > Service Workers
5. Check "Offline" to test offline functionality
6. Use "Add to Home Screen" to install as PWA

