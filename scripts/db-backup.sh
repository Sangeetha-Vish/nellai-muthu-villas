#!/bin/bash

# Configuration
DB_NAME="nellai_muthu"
BACKUP_DIR="./backups"
RETENTION_DAYS=7
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting database backup for $DB_NAME..."

# Run pg_dump (Assumes environment variables like PGPASSWORD are set if needed)
if pg_dump "$DB_NAME" > "$BACKUP_FILE"; then
    echo "Backup successful: $BACKUP_FILE"
    
    # Compress the backup
    gzip "$BACKUP_FILE"
    echo "Backup compressed: ${BACKUP_FILE}.gz"
    
    # Delete backups older than RETENTION_DAYS
    find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +$RETENTION_DAYS -exec rm {} \;
    echo "Old backups cleaned up (Retention: $RETENTION_DAYS days)."
else
    echo "Error: Database backup failed."
    exit 1
fi

echo "Backup process complete."
