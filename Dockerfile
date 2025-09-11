# Use the official Node.js 20 Alpine image for a small, secure base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install only production dependencies (no devDependencies)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the Express app runs on
EXPOSE 5001

# Start the application
CMD ["node", "src/index.js"] 