FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build TypeScript -> compiles to dist/
RUN npm run build

EXPOSE 5000

# Runs compiled JS from dist/server.js (defined in package.json "start")
CMD ["npm", "start"]
