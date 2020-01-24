FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies 
RUN npm install --no-optional && npm cache clean --force

# Copy all the files
COPY . .
