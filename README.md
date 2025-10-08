# Monorepo Example

A modern monorepo setup with infrastructure services and development tools.

## Table of Contents

- [Development](#development)
- [Infrastructure Services](#infrastructure-services)

## Development

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment variables**

   Some apps require `.env.local` files (look for `.env.local.example` files in each app).

3. **Start infrastructure services** (optional, see [Infrastructure Services](#infrastructure-services))

   ```bash
   cd infra
   docker compose up -d
   ```

4. **Start development**

   ```bash
   pnpm dev
   ```

### Useful Commands

#### Adding UI Components

Add shadcn components to your app from the root of your workspace:

```bash
# Add to default web app
pnpm dlx shadcn@canary add [component-name]

# Add to specific app
pnpm dlx shadcn@canary add [component-name] -c apps/[app-name]
```

#### Generate Better Auth Secret

Generate a secure secret for Better Auth configuration:

```bash
pnpx @better-auth/cli@latest secret
```

This generates a cryptographically secure random string to use as `BETTER_AUTH_SECRET` in your `.env.local` files.

#### Generate Better Auth Schema

Generate the Better Auth database schema:

```bash
pnpm auth:generate
```

#### Database Management

Manage your database schema with Drizzle Kit:

```bash
# Generate migrations from schema
pnpm db:generate

# Run pending migrations
pnpm db:migrate

# Push schema changes directly to database (development only)
pnpm db:push
```

### Production Deployment

#### Docker / Bare Metal Deployments

For Docker or bare metal deployments, you need to enable standalone output mode in `next.config.ts` file. This optimizes the build by:

- Creating a minimal standalone build
- Reducing the Docker image size
- Including only necessary dependencies

## Infrastructure Services

This project includes Docker Compose infrastructure services that can be started independently.

For detailed information about available services, ports, credentials, and management commands, see the [Infrastructure README](infra/README.md).
