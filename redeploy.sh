#!/bin/bash

# Check if the script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo."
  exit 1
fi

# Define variables
PROJECT_DIR="/root/masjid-signage"
PROJECT_CLONE_DIR="/root/masjid-signage-clone"
NGINX_CONFIG="/etc/nginx/sites-available/esauniverse.com.conf"  # Adjust this to your Nginx config file
PROJECT_SERVICE_FILE="masjid.service"  # Adjust this to your systemd service file

# 1. Determine the currently running port and folder
CURRENT_PORT=$(netstat -tuln | grep :7000 | sed 's/.*://g' | awk '{print $1}')
if [ -z "$CURRENT_PORT" ]; then
  # if CURRENT_PORT is empty, then the app is running in the clone folder
  CURRENT_APP_DIR="$PROJECT_CLONE_DIR"
  CURRENT_PORT=7700

  OTHER_APP_DIR="$PROJECT_DIR"
  OTHER_PORT=7000
else
  # if CURRENT_PORT is not empty, then the app is running in the main folder
  CURRENT_APP_DIR="$PROJECT_DIR"
  CURRENT_PORT=7000

  OTHER_APP_DIR="$PROJECT_CLONE_DIR"
  OTHER_PORT=7700
fi

echo "Current port: $CURRENT_PORT"
echo "Current app dir: $CURRENT_APP_DIR"

# 2. Pull latest code from GitHub to the other folder
git -C "$OTHER_APP_DIR" pull origin main
git -C "$OTHER_APP_DIR" reset --hard origin/main

# 3. Build the app in the other folder
source /root/.nvm/nvm.sh
cd "$OTHER_APP_DIR"
rm -r node_modules
npm i
npx prisma migrate deploy
npx prisma generate
rm -r .next
npm run build

# 4. Reassign the working directory and port in the systemd service file
sed -i "s|WorkingDirectory=$CURRENT_APP_DIR|WorkingDirectory=$OTHER_APP_DIR|" /etc/systemd/system/$PROJECT_SERVICE_FILE
sed -i "s|-p $CURRENT_PORT|-p $OTHER_PORT|" /etc/systemd/system/$PROJECT_SERVICE_FILE

# Restart the systemd service
systemctl daemon-reload
systemctl restart $PROJECT_SERVICE_FILE

# 5. Reassign the proxy_pass in the Nginx configuration
sed -i "s|proxy_pass http://localhost:$CURRENT_PORT|proxy_pass http://localhost:$OTHER_PORT|" "$NGINX_CONFIG"

# 6. Restart Nginx
systemctl restart nginx
