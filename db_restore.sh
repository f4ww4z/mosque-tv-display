#!/bin/bash

DATABASE_CONTAINER="mosque-tv-display"

# Check if SQL file is provided as argument
if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup-file.sql>"
    echo "Example: $0 backup.sql"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file '${BACKUP_FILE}' not found"
    exit 1
fi

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
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

echo "Starting database restore..."
echo "Database: ${POSTGRES_DB}"
echo "User: ${POSTGRES_USER}"
echo "Source file: ${BACKUP_FILE}"
echo "File size: $(du -h "${BACKUP_FILE}" | cut -f1)"

# Warning prompt
echo ""
echo "⚠️  WARNING: This will replace ALL data in the database '${POSTGRES_DB}'"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

echo "Restoring database..."

# Drop and recreate database to ensure clean restore
echo "Dropping existing database..."
docker exec -i ${DATABASE_CONTAINER} psql -U "${POSTGRES_USER}" -d postgres -c "DROP DATABASE IF EXISTS \"${POSTGRES_DB}\";"

echo "Creating new database..."
docker exec -i ${DATABASE_CONTAINER} psql -U "${POSTGRES_USER}" -d postgres -c "CREATE DATABASE \"${POSTGRES_DB}\";"

# Restore the database
echo "Restoring data..."
cat "${BACKUP_FILE}" | docker exec -i ${DATABASE_CONTAINER} psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"

if [ $? -eq 0 ]; then
    echo "✅ Database restore completed successfully!"
    echo "Database '${POSTGRES_DB}' has been restored from '${BACKUP_FILE}'"
else
    echo "❌ Database restore failed!"
    exit 1
fi
