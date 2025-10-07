# Monorepo Example

A modern monorepo setup with infrastructure services and development tools.

## Table of Contents

- [Development](#development)
- [Infrastructure Services](#infrastructure-services)

## Development

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

## Infrastructure Services

This project includes Docker Compose infrastructure services that can be started independently.

For detailed information about available services, ports, credentials, and management commands, see the [Infrastructure README](infra/README.md).
