# Use the official MongoDB Docker image
FROM mongo

# Copy the startup script into the container
COPY init.sh /docker-entrypoint-initdb.d/init.sh

# Set the execute permission for the script
RUN chmod +x /docker-entrypoint-initdb.d/init.sh