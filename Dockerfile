# Use Node.js Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start in development mode (with hot reload)
CMD ["npm", "run", "start:dev"]