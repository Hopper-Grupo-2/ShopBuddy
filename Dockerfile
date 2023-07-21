FROM node:lts-alpine3.17

WORKDIR /app
COPY package*.json ./
RUN npm install

# Change to client directory and install dependencies there
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

# Switch back to /app as working directory
WORKDIR /app

COPY . .

#EXPOSE 4021

#CMD ["npm", "run", "dev"]
