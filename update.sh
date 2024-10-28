#!/bin/bash
# Build and restart the Docker containers from the app directory (~/myapp)
echo "Rebuilding and restarting Docker containers..."
sudo docker-compose -f dev.docker-compose.yml down
sudo docker-compose -f dev.docker-compose.yml up --build -d

# Check if Docker Compose started correctly
if ! sudo docker-compose -f dev.docker-compose.yml ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Update complete. Your Next.js app has been deployed with the latest changes."

