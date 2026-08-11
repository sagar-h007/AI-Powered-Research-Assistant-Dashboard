# Build stage for the React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build stage for the Node backend
FROM node:18-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production

# Copy backend source
COPY server/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/client/dist /app/client/dist

# Expose port and start application
EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["npm", "start"]
