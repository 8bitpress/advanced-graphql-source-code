FROM node:12-alpine

# Get and set the environment variables
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Make directory for the application, owned by the node user
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Change into the app directory
WORKDIR /home/node/app

# Switch to the node user
USER node

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies 
RUN npm install --no-optional pm2 -g && \
  npm install --no-optional && npm cache clean --force

# Copy all the files and make the node user the owner
COPY --chown=node:node . .
