# Persistent Data Storage with Docker Volumes

## Introduction

When working with Docker containers, one critical challenge is data persistence. By default, any data written inside a container is lost when the container is removed. This guide explores Docker volumes as the solution to this problem.

## Understanding Docker Volumes

### Types of Volume Mounts
- Named volumes
- Bind mounts
- tmpfs mounts (memory-only)

### Why Use Volumes?
- Data persistence across container restarts
- Share data between containers
- Better backup and migration strategies

## Hands-On Practice

### 1. Creating a MySQL Container with Named Volume

```bash
docker run -d \
    --name mysql-db \
    -e MYSQL_ROOT_PASSWORD=rootpassword \
    -e MYSQL_DATABASE=testdb \
    -v mysql_data:/var/lib/mysql \
    mysql:8.0
```

### 2. Testing Data Persistence

Connect to MySQL and create test data:
```bash
docker exec -it mysql-db mysql -u root -p

# Inside MySQL shell
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;
CREATE TABLE users (id INT, name VARCHAR(50));
INSERT INTO users VALUES (1, 'John');
```

### 3. Verifying Data Persistence

```bash
# Stop and remove container
docker stop mysql-db
docker rm mysql-db

# Recreate container with same volume
docker run -d \
    --name mysql-db \
    -e MYSQL_ROOT_PASSWORD=rootpassword \
    -v mysql_data:/var/lib/mysql \
    mysql:8.0
```

### 4. Volume Management Commands

```bash
# List volumes
docker volume ls

# Inspect volume details
docker volume inspect mysql_data

# Clean up unused volumes
docker volume prune
```

## Best Practices
- Always use named volumes for databases
- Regularly backup volume data
- Use volume labels for better organization
- Remove unused volumes to free up space

## Next Steps
- Explore volume drivers for cloud storage
- Learn about volume backup strategies
- Understand volume sharing between containers
