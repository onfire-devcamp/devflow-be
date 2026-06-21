FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies for building)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code and build
COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

# Install ONLY production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Expose port and run the server
EXPOSE 3000
CMD ["node", "dist/server.js"]
