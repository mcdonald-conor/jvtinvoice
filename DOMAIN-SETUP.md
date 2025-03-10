# Setting Up km.railsmiths.com Domain with Coolify

This document provides step-by-step instructions for setting up the `km.railsmiths.com` domain with your Coolify deployment.

## Prerequisites

- Access to your Coolify dashboard
- Access to your DNS provider for railsmiths.com
- Your application deployed on Coolify

## Step 1: Fix Mobile Access Issues

Before setting up the domain, let's fix the mobile access issues:

1. **Check Content-Type Headers**:
   - We've added middleware and Next.js configuration to ensure proper content-type headers
   - Deploy these changes to your Coolify instance
   - Test mobile access using the `/mobile-test.html` page

2. **Verify Coolify Configuration**:
   - Make sure your Coolify instance is properly configured for mobile access
   - Check that HTTPS is enabled (required for proper mobile browser behavior)
   - Ensure proper port forwarding is configured

## Step 2: Add Custom Domain in Coolify

1. Log in to your Coolify dashboard
2. Navigate to your KM Joinery Quote Generator application
3. Go to the "Settings" or "Domains" section
4. Add `km.railsmiths.com` as a custom domain
5. Enable HTTPS for this domain (recommended)
6. Save the changes

## Step 3: Configure DNS Records

1. Log in to your DNS provider for railsmiths.com
2. Add a new DNS record:
   - **Type**: A or CNAME
   - **Name**: km
   - **Value**:
     - If A record: Your Coolify server's IP address
     - If CNAME record: Your Coolify server's hostname
   - **TTL**: 3600 (or as recommended by your provider)

3. Save the changes

## Step 4: Verify Domain Setup

1. Wait for DNS propagation (can take up to 24-48 hours, but often much faster)
2. Test the domain by visiting https://km.railsmiths.com
3. Verify that the site loads correctly on both desktop and mobile devices

## Step 5: Additional Configuration (Optional)

1. **Set up redirects**:
   - Redirect www.km.railsmiths.com to km.railsmiths.com (if needed)
   - Redirect HTTP to HTTPS

2. **Configure SSL certificate**:
   - Coolify should handle this automatically if you enabled HTTPS
   - Verify that the SSL certificate is valid and properly installed

## Troubleshooting

If you encounter issues:

1. **DNS Issues**:
   - Use `dig km.railsmiths.com` or `nslookup km.railsmiths.com` to check DNS resolution
   - Verify that the DNS record points to the correct IP address or hostname

2. **SSL Issues**:
   - Check that the SSL certificate is properly issued and installed
   - Verify that the certificate covers km.railsmiths.com

3. **Mobile Access Issues**:
   - Test with the `/mobile-test.html` page to gather diagnostic information
   - Check server logs for any errors related to mobile user agents
   - Verify that content-type headers are being properly set

## Support

If you continue to experience issues, check the Coolify documentation or contact their support team for assistance.
