# Infrastructure Services

This directory contains Docker Compose configurations for various infrastructure services used in the monorepo.

## Services

| Service | Port | Purpose | Access URL | Credentials |
|---------|------|---------|------------|-------------|
| **PostgreSQL** | 5432 | Database | `postgresql://localhost:5432` | admin/admin_password |
| **Redis** | 6379 | Cache | `redis://localhost:6379` | - |
| **RabbitMQ** | 5672 | AMQP | `amqp://localhost:5672` | admin/admin |
| **RabbitMQ Management** | 15672 | Web UI | <http://localhost:15672> | admin/admin |
| **Keycloak** | 8083 | HTTP API | <http://localhost:8083> | admin/admin |
| **Keycloak Health** | 9000 | Health/Metrics | <http://localhost:9000/health/ready> | - |
| **OpenFGA HTTP** | 8082 | HTTP API | <http://localhost:8082> | - |
| **OpenFGA gRPC** | 8081 | gRPC API | `localhost:8081` | - |
| **OpenFGA Playground** | 3901 | Web UI | <http://localhost:3901/playground> | - |
| **OpenFGA Metrics** | 2112 | Metrics | <http://localhost:2112/metrics> | - |
| **OpenFGA Tracing** | 4317 | OTLP Traces | `localhost:4317` | - |

### Service Details

#### PostgreSQL

- **Database**: postgres (default), server_example, keycloak, openfga
- **Users**: admin, server_example, keycloak, openfga
- **Configuration**: `postgresql.yml`

#### Redis

- **Configuration**: `redis.yml`

#### RabbitMQ

- **Default User**: admin/admin
- **Configuration**: `rabbitmq.yml`

#### Keycloak

- **Admin User**: admin/admin
- **Database**: Uses PostgreSQL
- **Configuration**: `keycloak.yml`

#### OpenFGA

- **Database**: Uses PostgreSQL (openfga database)
- **Configuration**: `openfga.yml`

## Getting Started

1. Start all services:

   ```bash
   docker-compose up -d
   ```

2. Check service status:

   ```bash
   docker-compose ps
   ```

3. View logs for a specific service:

   ```bash
   docker-compose logs -f <service-name>
   ```

## OpenFGA Usage

### Accessing OpenFGA

- **HTTP API**: <http://localhost:8082>
- **gRPC API**: <localhost:8081>
- **Playground**: <http://localhost:3901>
- **Metrics**: <http://localhost:2112/metrics>
- **Health Check**: <http://localhost:8082/healthz>

### Playground Limitations

The OpenFGA Playground is designed for development and prototyping with several limitations:

- **Localhost only**: Cannot run on hosts other than localhost
- **No OIDC authentication**: Authentication is not supported
- **Limited tuples**: Loads up to 100 tuples maximum
- **No conditional tuples**: Does not support conditional or contextual tuples
- **Production use**: Not recommended for production deployments

For production use, consider using:

- Visual Studio Code integration
- OpenFGA CLI
- `.fga.yaml` files for model + tuples + assertions

### Authentication

The OpenFGA service is configured with no authentication by default for development. For production use, you should configure authentication using either:

1. **Pre-shared key authentication**
2. **OIDC authentication**

### Example API Usage

```bash
# Check if a user can access a resource
curl -X POST http://localhost:8082/stores/{store_id}/check \
  -H "Content-Type: application/json" \
  -d '{
    "tuple_key": {
      "user": "user:anne",
      "relation": "can_view", 
      "object": "document:roadmap"
    }
  }'
```

### Database Migration

The OpenFGA database migration runs automatically when the service starts. The migration creates the necessary tables in the PostgreSQL `openfga` database.

## Service Dependencies

- **Keycloak** depends on **PostgreSQL**
- **OpenFGA** depends on **PostgreSQL** and runs migration automatically
- All services use the default Docker network for communication

## Volumes

Persistent data is stored in Docker volumes:

- `postgres_data`: PostgreSQL data
- `redis_data`: Redis data  
- `rabbitmq-lib`, `rabbitmq-log`: RabbitMQ data
- `keycloak_data`: Keycloak data

## Health Checks

All services include health checks to ensure they're running properly. You can check the health status using:

```bash
docker-compose ps
```

Services with "healthy" status are ready to use.
