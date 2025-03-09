// This is a simple script to help check your Coolify configuration
// You can run this with Node.js to see if there are any issues

console.log('Checking Coolify configuration for KM Joinery Quote Generator');
console.log('-----------------------------------------------------------');

// Check environment
console.log('Environment Check:');
console.log('- Node.js version:', process.version);
console.log('- Operating system:', process.platform);
console.log('- Architecture:', process.arch);

// Recommendations for Coolify settings
console.log('\nRecommended Coolify Settings:');
console.log('1. Ensure your Coolify deployment has the following settings:');
console.log('   - Content-Type headers are properly set');
console.log('   - HTTPS is enabled (required for mobile browsers)');
console.log('   - Proper port forwarding is configured');
console.log('   - Node.js version is compatible with your Next.js app');

// Domain configuration
console.log('\nDomain Configuration for km.railsmiths.com:');
console.log('1. In your Coolify dashboard:');
console.log('   - Add km.railsmiths.com as a custom domain');
console.log('   - Enable HTTPS for this domain');
console.log('   - Set up proper DNS records (A or CNAME) pointing to your Coolify server');

// DNS configuration
console.log('\nDNS Configuration:');
console.log('1. Add the following DNS records to your domain provider:');
console.log('   - A Record: km.railsmiths.com → [Your Coolify Server IP]');
console.log('   - OR CNAME Record: km.railsmiths.com → [Your Coolify Server Hostname]');

// Mobile troubleshooting
console.log('\nMobile Access Troubleshooting:');
console.log('1. Check if your server is properly responding to mobile user agents');
console.log('2. Ensure Content-Type headers are set correctly');
console.log('3. Verify that your server is accessible from mobile networks');
console.log('4. Check if any firewall or security settings are blocking mobile access');

console.log('\nAfter making these changes, rebuild and redeploy your application in Coolify.');
console.log('-----------------------------------------------------------');

// Exit with success code
process.exit(0);
