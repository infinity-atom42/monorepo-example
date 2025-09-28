# Monorepo Example

## Infrastructure Services

This project includes Docker Compose infrastructure services that can be started independently.

### Available Services

- **PostgreSQL** (port 5432) - Database service
- **RabbitMQ** (ports 5672, 15672) - Message broker with management UI
- **Keycloak** (port 8080) - Identity and access management
- **Redis** (port 6379) - In-memory data store

### Running Infrastructure Services

#### Start services

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

#### Stop services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

#### View service status

```bash
# Check running services
docker compose ps

# View service logs
docker compose logs [service-name]

# Follow logs in real-time
docker compose logs -f [service-name]
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@canary add [component-name]
pnpm dlx shadcn@canary add [component-name] -c apps/[app-name]
```
