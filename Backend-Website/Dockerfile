# Use Node.js as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g @angular/cli

# Copy the rest of the application source code
COPY . .

RUN apt update && apt install -y jq

# Make sure the backend script is executable
RUN chmod +x ./controllers/Backend/Node/run-Node-Mongodb.sh \
    && chmod +x ./controllers/Backend/Node/run-Node-Mysql.sh \
    && chmod +x ./controllers/Frontend/Angular/run-Angular.sh
# Expose the port your app runs on
EXPOSE 5000

# Command to run your application
CMD ["node", "app.js"]
