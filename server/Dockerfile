# Use the official lightweight Node.js 20 image.
FROM node:20-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Set environment variable for production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5000

# Run the web service on container startup.
CMD [ "npm", "start" ]
