# Use an official Node.js runtime as a parent image.
# Using 'lts' (Long-Term Support) is a good practice for stability.
FROM node:18-slim

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
# This leverages Docker's layer caching. These files don't change often,
# so this layer won't be rebuilt unless dependencies change.
COPY package*.json ./

# Install application dependencies in the container
# --only=production can be used to avoid installing devDependencies in production images
RUN npm install

# Copy the rest of your application's source code into the container
COPY . .

# Expose the port your app runs on to Docker
# This should match the port your application listens on (e.g., process.env.PORT || 3000)
EXPOSE 3000

# Define the command to run your application when the container starts
# Using this array format is the preferred 'exec' form
CMD [ "node", "app.js" ]
