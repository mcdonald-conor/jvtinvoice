#!/bin/bash

# Create a clean directory
echo "Creating a clean directory..."
mkdir -p ../kminvoice-clean

# Copy all files except node_modules and .git
echo "Copying files (excluding node_modules and .git)..."
rsync -av --progress ./ ../kminvoice-clean/ --exclude node_modules --exclude .git --exclude .next

# Initialize a new Git repository
echo "Initializing a new Git repository..."
cd ../kminvoice-clean
git init

# Create a proper .gitignore file
echo "Creating .gitignore file..."
cat > .gitignore << 'EOL'
# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.idea
.vscode

# Logs
logs
*.log

# Cache
.cache/
EOL

# Create .env.example file
echo "Creating .env.example file..."
cat > .env.example << 'EOL'
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add any other environment variables your application needs here
# DATABASE_URL=
# API_KEY=
# etc.
EOL

# Create .dockerignore file
echo "Creating .dockerignore file..."
cat > .dockerignore << 'EOL'
# Versioning and metadata
.git
.gitignore
.dockerignore

# Build dependencies
node_modules
npm-debug.log
yarn-debug.log
yarn-error.log

# Environment (contains sensitive data)
.env
.env.*

# Files not required for production
README.md
Dockerfile
docker-compose.yml
.eslintrc.json
.prettierrc
.vscode
.idea
*.log
*.md
tests

# Next.js build output
.next
out

# Misc
.DS_Store
EOL

# Add all files to Git
echo "Adding files to Git..."
git add .

# Commit the files
echo "Committing files..."
git commit -m "Initial commit"

echo "Done! Your clean repository is ready at ../kminvoice-clean"
echo "To push to GitHub, run the following commands:"
echo "cd ../kminvoice-clean"
echo "git remote add origin https://github.com/mcdonald-conor/kminvoice.git"
echo "git push -u origin main"
