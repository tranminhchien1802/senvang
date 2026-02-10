FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY my-backend/package*.json ./my-backend/

# Install dependencies for both frontend and backend
RUN npm install
RUN cd my-backend && npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 5173

# Start both frontend and backend
CMD ["sh", "-c", "cd my-backend && npm start & cd .. && npm run preview"]