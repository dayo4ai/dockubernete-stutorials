# Persistent Data Storage with Docker Volumes

```mermaid
%%{init: {'theme': 'forest'}}%%

graph TB
    %% Setup Phase
    A[Start] --> B[Create Project Directory]
    B --> C[Create docker-compose.yml]
    C --> D[Define MySQL Service]
    
    %% Configuration Details
    D --> E[Set Environment Variables]
    D --> F[Configure Volume]
    D --> G[Set Port Mapping]
    
    %% Execution Flow
    subgraph "Docker Compose Commands"
        H[docker-compose up -d] --> I{Check Status}
        I -->|Success| J[MySQL Running]
        I -->|Failure| K[Check Logs]
        K --> L[Troubleshoot]
        L --> H
    end
    
    %% Volume Operations
    subgraph "Data Persistence"
        M[Create Volume] --> N[Store MySQL Data]
        N --> O[Container Restart]
        O --> P{Data Preserved?}
        P -->|Yes| Q[Success]
        P -->|No| R[Check Volume]
    end
    
    %% Management Commands
    subgraph "Management"
        S[docker-compose ps]
        T[docker-compose logs]
        U[docker-compose down]
    end
    
    %% Styling
    classDef setup fill:#e1f5fe,stroke:#01579b
    classDef execution fill:#e8f5e9,stroke:#1b5e20
    classDef volume fill:#fff3e0,stroke:#e65100
    classDef command fill:#f3e5f5,stroke:#4a148c
    
    class A,B,C,D setup
    class H,I,J,K,L execution
    class M,N,O,P,Q,R volume
    class S,T,U command
```

## Introduction

When working with Docker containers, one critical challenge is data persistence. By default, any data written inside a container is lost when the container is removed. This guide demonstrates how Docker volumes solve this problem, with a practical example showing data preservation.

## Understanding Docker Volumes

Docker volumes provide persistent storage that exists independently of containers. When a container is removed and recreated using the same volume, the data remains intact.

### Key Benefits
- Data persists across container lifecycles
- Efficient data sharing between containers
- Independent backup and restore capabilities

## Practical Example: MySQL with Persistent Storage

### 1. Initial Setup

```bash
# Create a MySQL container with a named volume
docker run -d \
    --name mysql-db \
    -e MYSQL_ROOT_PASSWORD=secretpass \
    -v mysql_data:/var/lib/mysql \
    mysql:8.0
```

### 2. Create Test Data

```bash
# Connect to MySQL
docker exec -it mysql-db mysql -u root -p

# Create and populate test table
CREATE DATABASE testdb;
USE testdb;
CREATE TABLE users (id INT, name VARCHAR(50));
INSERT INTO users VALUES (1, 'Alice');
```

### 3. Test Data Persistence

```bash
# Remove the container
docker rm -f mysql-db

# Create new container with same volume
docker run -d \
    --name mysql-db \
    -e MYSQL_ROOT_PASSWORD=secretpass \
    -v mysql_data:/var/lib/mysql \
    mysql:8.0

# Verify data still exists
docker exec -it mysql-db mysql -u root -p testdb -e "SELECT * FROM users;"
```

## Volume Management

```bash
# List all volumes
docker volume ls

# Inspect volume details
docker volume inspect mysql_data

# Remove unused volumes
docker volume prune
```

## Best Practices
- Use named volumes for easier management
- Implement regular backup strategies
- Label volumes appropriately
- Clean up unused volumes periodically

