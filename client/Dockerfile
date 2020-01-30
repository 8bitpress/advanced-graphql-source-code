#########################################################
# BASE
#########################################################

FROM node:12-alpine AS base

# Create app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies 
RUN npm install --no-optional && npm cache clean --force

# Copy all the files
COPY . .

#########################################################
# BUILDER
#########################################################

FROM base AS builder

# Create the built files
RUN npm run build

#########################################################
# PRODUCTION
#########################################################

FROM nginx:1.17-alpine AS production

# Expose port 3000 internally
EXPOSE 3000

# Copy over the nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy over the previously built files
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
