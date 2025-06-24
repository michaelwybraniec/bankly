# Dockerfile for Audit Logger Microservice
FROM node:20-slim

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --omit=dev || yarn install --production --frozen-lockfile

# Copy source and build output
COPY . .

# If using TypeScript, build to dist/
RUN npm run build || yarn build

EXPOSE 4001

CMD ["node", "dist/scripts/start-consumer.js"] 