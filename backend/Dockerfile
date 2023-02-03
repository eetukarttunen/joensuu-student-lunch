# Use node:12 as the base image
FROM node:12

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the required dependencies
RUN npm install

# Copy the rest of the code to the working directory
COPY . .

# Expose the port 3001
EXPOSE 3001

# Start the application
CMD ["node", "App.js"]