# Multi-stage Dockerfile for Velo Hugging Face Space

# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package descriptors
COPY package.json pnpm-lock.yaml ./

# Install dependencies without running native build scripts
RUN pnpm install --ignore-scripts

# Copy source code
COPY . .

# Build Vite web application assets
RUN npx vite build

# Stage 2: Runner
FROM node:22-alpine AS runner

WORKDIR /app

# Install express for web server
RUN npm install express

# Copy built frontend assets and server wrapper
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# Hugging Face Spaces default port
EXPOSE 7860

ENV PORT=7860
ENV NODE_ENV=production

CMD ["node", "server.js"]
