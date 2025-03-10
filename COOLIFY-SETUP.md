# Deploying to Coolify

This document provides instructions for deploying this Next.js application to Coolify.

## Prerequisites

- A Coolify instance set up and running
- Access to the Coolify dashboard
- A server connected to your Coolify instance

## Deployment Steps

1. **Create a New Application in Coolify**
   - In your Coolify dashboard, click "New Resource"
   - Select "Application"
   - Choose "Next.js" as the application type

2. **Configure the Application**
   - Connect to your Git repository
   - Set the following configuration:
     - Build Command: `npm run build`
     - Start Command: `npm start`
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

If you encounter issues:

1. **Check Coolify Logs**
   - Review the build and deployment logs for errors

2. **Verify Domain Configuration**
   - Ensure your DNS records are correctly pointing to your Coolify server
   - Check that HTTPS is properly configured

3. **Check Application Configuration**
   - Verify that the build and start commands are correct
   - Ensure the port is set to 3000

4. **Browser Issues**
   - Clear your browser cache
   - Try accessing the site in an incognito/private window
   - Temporarily disable browser extensions

## Additional Resources

- [Coolify Documentation for Next.js](https://coolify.io/docs/applications/next-js)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
