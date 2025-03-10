# Deploying to Coolify

This document provides comprehensive instructions for deploying this Next.js application to Coolify.

## Prerequisites

- A Coolify instance set up and running
- Access to the Coolify dashboard
- A server connected to your Coolify instance

## Deployment Method 1: Using Dockerfile (Recommended)

1. **Create a New Application in Coolify**
   - In your Coolify dashboard, click "New Resource"
   - Select "Application"
   - Choose "Dockerfile" as the application type

2. **Configure the Application**
   - Connect to your Git repository
   - Ensure the Dockerfile is detected
   - Set the following configuration:
     - Port: `3000`
     - Container Port: `3000`

3. **Configure Environment Variables (if needed)**
   - Add any required environment variables in the "Environment Variables" section

4. **Configure Custom Domain**
   - In the "Domains" section, add your custom domain (e.g., km.railsmiths.com)
   - Enable HTTPS (Let's Encrypt)
   - Make sure your DNS records are pointing to your Coolify server

5. **Deploy the Application**
   - Click "Deploy" to start the deployment process

## Deployment Method 2: Using Next.js Template

If the Dockerfile method doesn't work, try using the Next.js template:

1. **Create a New Application in Coolify**
   - In your Coolify dashboard, click "New Resource"
   - Select "Application"
   - Choose "Next.js" as the application type

2. **Configure the Application**
   - Connect to your Git repository
   - Set the following configuration:
     - Build Command: `npm run build`
     - Start Command: `node server.js` (not the default `npm start`)
     - Port: `3000`

3. **Configure Environment Variables (if needed)**
   - Add any required environment variables in the "Environment Variables" section

4. **Configure Custom Domain**
   - In the "Domains" section, add your custom domain (e.g., km.railsmiths.com)
   - Enable HTTPS (Let's Encrypt)
   - Make sure your DNS records are pointing to your Coolify server

5. **Deploy the Application**
   - Click "Deploy" to start the deployment process

## Troubleshooting

If you encounter the "No Available Server" error:

1. **Check Coolify Logs**
   - Review the build and deployment logs for errors
   - Look for any port conflicts or binding issues

2. **Verify Server Status**
   - Check if the server is running using the Coolify terminal
   - Run `docker ps` to see if your container is running
   - Check logs with `docker logs [container_id]`

3. **Test the Health Endpoint**
   - Try accessing `/api/health` to see if the server is responding
   - This endpoint should return a JSON response with status "ok"

4. **Check Network Configuration**
   - Ensure the server is binding to the correct address (0.0.0.0)
   - Verify that port 3000 is exposed and not blocked by firewalls

5. **Verify Domain Configuration**
   - Ensure your DNS records are correctly pointing to your Coolify server
   - Check that HTTPS is properly configured
   - Try accessing the site using the Coolify-generated URL instead of your custom domain

6. **Container Issues**
   - Try restarting the container
   - Check if there are resource constraints (CPU/memory)

7. **Browser Issues**
   - Clear your browser cache
   - Try accessing the site in an incognito/private window
   - Temporarily disable browser extensions

## Additional Resources

- [Coolify Documentation for Next.js](https://coolify.io/docs/applications/next-js)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Docker Deployment for Next.js](https://nextjs.org/docs/deployment#docker-image)
