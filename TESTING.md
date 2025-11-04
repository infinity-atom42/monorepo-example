# Testing Guide

Guide for running tests and linting across the monorepo.

## Quick Start

```bash
# 1. Start test database
docker compose -f docker-compose.test.yml up -d

# 2. Run all tests
pnpm test

# 3. Run linting
pnpm lint

# 4. Stop test database and remove data
docker compose -f docker-compose.test.yml down -v
```

## Running Tests

### Run All Packages

```bash
# Run all tests in monorepo
pnpm test

# Or using turbo
turbo test
```

### Run Specific Package

```bash
# Run tests for server-example
pnpm --filter server-example test

# Watch mode
pnpm --filter server-example test:watch
```

### Run Specific Test File

```bash
# From package directory
cd apps/server-example
bun test test/db.test.ts

# Or specify path from root
pnpm --filter server-example exec bun test test/db.test.ts
```

## Linting

### Lint All Packages

```bash
# Lint all packages
pnpm lint

# Fix linting issues automatically
pnpm lint:fix
```

### Lint Specific Package

```bash
# Lint server-example
pnpm --filter server-example lint

# Fix issues
pnpm --filter server-example lint:fix
```

### Type Checking

```bash
# Check types across all packages
pnpm type:check

# Check specific package
pnpm --filter server-example type:check
```

## Test Database

### Configuration

- **Host**: localhost:5433 (port 5433 to avoid conflict with dev DB on 5432)
- **Storage**: Anonymous volume (removed with `docker-compose down -v`)
- **Init**: Reuses `infra/postgresql/init-databases.sql`
- **Healthcheck**: Optimized for fast startup (~2-5 seconds)

### Commands

```bash
# Start test database
docker compose -f docker-compose.test.yml up -d

# Check status
docker compose -f docker-compose.test.yml ps

# View logs
docker compose -f docker-compose.test.yml logs -f

# Stop database (keeps data)
docker compose -f docker-compose.test.yml down

# Stop and remove data
docker compose -f docker-compose.test.yml down -v
```

## Current Test Coverage

### ✅ server-example

- Location: `apps/server-example/test/`
- Test runner: Bun
- Database: PostgreSQL (tmpfs)
- See: [apps/server-example/test/README.md](apps/server-example/test/README.md)

### 🚧 Coming Soon

- web-example
- job workers (order-example, payment-example, notifications-example)
- packages

## CI/CD Integration

```bash
# Example CI script
docker compose -f docker-compose.test.yml up -d
pnpm install
pnpm lint
pnpm type:check
pnpm test
docker compose -f docker-compose.test.yml down
```

## Troubleshooting

### Tests failing to connect to database

```bash
# Check if database is running
docker compose -f docker-compose.test.yml ps

# Check health status
docker compose -f docker-compose.test.yml exec postgresql-test pg_isready -d postgres -U admin

# Restart database
docker compose -f docker-compose.test.yml restart
```

### Port 5433 already in use

Edit `infra/postgresql-test.yml` and change the port:

```yaml
ports:
  - '5434:5432' # Change to different port
```

Then update `.env.test` in the affected package.

### Linting errors

```bash
# Auto-fix most issues
pnpm lint:fix

# Format code
pnpm format:write
```

## Stack

- **Package Manager**: pnpm
- **Runtime**: Bun
- **Test Runner**: Bun test
- **Database**: PostgreSQL (Drizzle ORM)
- **Environment**: @t3-oss/env-core
- **Linter**: ESLint
- **Formatter**: Prettier
