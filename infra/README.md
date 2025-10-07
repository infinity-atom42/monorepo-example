# Infrastructure Services

This directory contains Docker Compose configurations for various infrastructure services used in the monorepo.

## Services

| Service                 | Port  | Purpose        | Access URL                           |
| ----------------------- | ----- | -------------- | ------------------------------------ |
| **PostgreSQL**          | 5432  | Database       | `postgresql://localhost:5432`        |
| **Redis**               | 6379  | Cache          | `redis://localhost:6379`             |
| **RabbitMQ**            | 5672  | AMQP           | `amqp://localhost:5672`              |
| **RabbitMQ Management** | 15672 | Web UI         | <http://localhost:15672>             |
| **Keycloak**            | 8083  | HTTP API       | <http://localhost:8083>              |
| **Keycloak Health**     | 9000  | Health/Metrics | <http://localhost:9000/health/ready> |
| **OpenFGA HTTP**        | 8082  | HTTP API       | <http://localhost:8082>              |
| **OpenFGA gRPC**        | 8081  | gRPC API       | `localhost:8081`                     |
| **OpenFGA Playground**  | 3901  | Web UI         | <http://localhost:3901/playground>   |
| **OpenFGA Metrics**     | 2112  | Metrics        | <http://localhost:2112/metrics>      |
| **OpenFGA Tracing**     | 4317  | OTLP Traces    | `localhost:4317`                     |

## Managing Services

### Start Services

```bash
# Start all services (see logs in real-time)
docker compose up

# Start all services in background
docker compose up -d

# Start all services with fresh volumes (⚠️ deletes existing data)
docker compose up -d --force-recreate

# Start specific services
docker compose up -d [service-name] [another-service-name]
```

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

### Monitor Services

```bash
# Check running services
docker compose ps

# View service logs
docker compose logs [service-name]

# Follow logs in real-time
docker compose logs -f [service-name]
```

## Authentication & Configuration

### PostgreSQL

- **Databases**: `postgres`, `web_example`, `server_example`, `keycloak`, `openfga`
- **Users**:
  - `admin` / `admin_password` (superuser)
  - `web_example` / `web_example_password`
  - `server_example` / `server_example_password`
  - `keycloak` / `keycloak_password`
  - `openfga` / `openfga_password`

### RabbitMQ

- **User**: `admin` / `admin`

### Keycloak

- **Admin**: `admin` / `admin`

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

All services include health checks to ensure they're running properly.
Use `docker compose ps` to view the health status - services with "healthy" status are ready to use.
