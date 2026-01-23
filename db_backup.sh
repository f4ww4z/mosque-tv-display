#!/bin/bash

DATABASE_CONTAINER="mosque-tv-display"

# Load environment variables from .env file
if [ -f .env ]; then
    set -a
    source .env
    set +a
else
    echo "Error: .env file not found"
    exit 1
fi

# Check if database container is running
if ! docker ps | grep -q "${DATABASE_CONTAINER}"; then
    echo "Error: Database container '${DATABASE_CONTAINER}' is not running"
    echo "Please start the container with: docker-compose up -d db"
    exit 1
fi

# Create timestamp for backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE=".db/backup_${POSTGRES_DB}_${TIMESTAMP}.sql"

echo "Starting database backup..."
echo "Database: ${POSTGRES_DB}"
echo "User: ${POSTGRES_USER}"
echo "Output file: ${BACKUP_FILE}"

mkdir -p .db

# Dump the database
docker exec -t ${DATABASE_CONTAINER} pg_dump -U "${POSTGRES_USER}" "${POSTGRES_DB}" > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "✅ Database backup completed successfully!"
    echo "Backup saved to: ${BACKUP_FILE}"
    echo "File size: $(du -h "${BACKUP_FILE}" | cut -f1)"
else
    echo "❌ Database backup failed!"
    exit 1
fi
