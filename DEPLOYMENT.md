# Deploying JVT Plastering Quote Generator with Coolify

This guide provides step-by-step instructions for deploying the JVT Plastering Quote Generator application using Coolify with Nixpacks as the build pack.

## Prerequisites

- A Coolify instance set up and running
- Access to your Git repository
- Basic knowledge of Docker and containerization

## Deployment Steps

### 1. Add Your Repository to Coolify

1. Log in to your Coolify dashboard
2. Navigate to "Sources" and click "New Source"
3. Select your Git provider (GitHub, GitLab, etc.)
4. Authenticate and select the repository containing the JVT Plastering Quote Generator

### 2. Create a New Service

1. In the Coolify dashboard, go to "Services" and click "New Service"
2. Select "Application" as the service type
3. Choose your repository from the sources list
4. Select "Nixpacks" as the build pack

### 3. Configure the Service

1. **Basic Configuration**:
   - Name: `km-joinery-quote-generator`
   - Port: `3000`

2. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `NEXT_TELEMETRY_DISABLED`: `1`

3. **Build & Deploy Settings**:
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Advanced Settings**:
   - Health Check Path: `/`
   - Health Check Timeout: `10`

### 4. Deploy the Application

1. Click "Save" to save your configuration
2. Click "Deploy" to start the deployment process
3. Monitor the build and deployment logs for any errors

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the build logs for specific errors
   - Ensure all dependencies are correctly specified in package.json
   - Verify that the Node.js version is compatible (18+)

2. **Runtime Errors**:
   - Check the application logs in Coolify
   - Verify that all environment variables are correctly set
   - Ensure the server.js file is being properly generated during the build

3. **Connection Issues**:
   - Verify that port 3000 is exposed and not blocked by any firewall
   - Check that the HOSTNAME is set to "0.0.0.0" to allow external connections

## Custom Domain Setup

To set up a custom domain for your application:

1. In the Coolify dashboard, go to your service settings
2. Navigate to the "Domains" section
3. Add your custom domain (e.g., `quotes.kmjoinery.com`)
4. Enable HTTPS if needed
5. Update your DNS records to point to your Coolify server

## Updating the Application

To update the application:

1. Push changes to your Git repository
2. Coolify will automatically detect the changes and trigger a new deployment
3. Monitor the deployment process in the Coolify dashboard

## Backup and Restore

Since this application doesn't have a database, there's no need for specific backup procedures. However, it's good practice to:

1. Keep your code repository backed up
2. Document any custom configurations or environment variables
3. Consider setting up automated deployments with CI/CD pipelines

## Support

If you encounter any issues with the deployment, refer to:

- [Coolify Documentation](https://coolify.io/docs)
- [Nixpacks Documentation](https://nixpacks.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
