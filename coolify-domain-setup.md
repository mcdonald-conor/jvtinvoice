# Coolify Domain Setup for km.railsmiths.com

This guide provides specific instructions for configuring your Coolify deployment to work with the custom domain `km.railsmiths.com`.

## MIME Type Issues Fix

The console errors you're seeing are related to MIME type issues. When using a custom domain with Coolify, sometimes the server doesn't correctly set the MIME types for JavaScript and CSS files. We've made the following changes to fix this:

1. Updated `next.config.mjs` to set specific Content-Type headers for different file types
2. Modified the middleware to be more selective about when to set Content-Type headers

## Coolify Configuration Steps

1. **Log in to your Coolify dashboard**

2. **Navigate to your KM Joinery application**

3. **Go to the "Settings" tab**

4. **Under "Environment Variables", add or update the following:**
   ```
   NODE_ENV=production
   ```

5. **Under "Build & Deploy", ensure the following settings:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Port: `3000`

6. **Under "Domains", add your custom domain:**
   - Domain: `km.railsmiths.com`
   - Enable HTTPS: Yes
   - Force HTTPS: Yes

7. **Under "Advanced", check these settings:**
   - Make sure "Proxy" is enabled
   - Set "NGINX Custom Configuration" to include:
   ```nginx
   # Fix MIME type issues
   location /_next/static/ {
     add_header Content-Type application/javascript;
     proxy_pass http://upstream;
   }

   location /_next/static/css/ {
     add_header Content-Type text/css;
     proxy_pass http://upstream;
   }
   ```

8. **Save changes and redeploy your application**

## DNS Configuration

1. **Log in to your DNS provider for railsmiths.com**

2. **Add an A record:**
   - Name: `km`
   - Value: [Your Coolify Server IP]
   - TTL: 3600 (or as recommended)

3. **Or add a CNAME record (if you prefer):**
   - Name: `km`
   - Value: [Your Coolify Server Hostname]
   - TTL: 3600 (or as recommended)

## Verify Setup

After making these changes and redeploying:

1. Visit https://km.railsmiths.com in your browser
2. Check the browser console for any remaining errors
3. Verify that JavaScript and CSS are loading correctly

## Troubleshooting

If you still see MIME type errors:

1. **Check Coolify logs** for any errors related to serving static files
2. **Verify NGINX configuration** is correctly applied
3. **Clear your browser cache** completely
4. **Try accessing the site in an incognito/private window**

If the issue persists, you may need to contact Coolify support for assistance with your specific server configuration.
