# @packages/cluster

A lightweight cluster manager for Node.js/Bun applications that handles multi-core worker spawning, graceful shutdown, and automatic worker restart on crashes.

## What is this package for?

This package eliminates boilerplate code for running clustered Node.js/Bun applications. It provides:

- **Multi-core utilization**: Automatically spawns workers for each CPU core in production
- **Development mode**: Runs a single worker for easier debugging
- **Graceful shutdown**: Coordinates clean shutdown of all workers with configurable timeout
- **Automatic restart**: Restarts crashed workers while preventing infinite restart loops
- **Flexible lifecycle hooks**: Callbacks for monitoring and customizing behavior at each stage

## Installation

Already installed as a workspace dependency:

```json
{
  "dependencies": {
    "@packages/cluster": "workspace:*"
  }
}
```

## Basic Usage

```typescript
import { startClusteredService } from '@packages/cluster'

await startClusteredService({
  serviceName: 'my-service',
  isProduction: process.env.NODE_ENV === 'production',
  workerModulePath: new URL('./worker.ts', import.meta.url).pathname,
  onWorkerShutdown: async ({ workerModule }) => {
    // Cleanup: close DB connections, channels, etc.
    await workerModule.db.close()
  },
})
```

## Configuration

### Required Options

| Option             | Type      | Description                                                                              |
| ------------------ | --------- | ---------------------------------------------------------------------------------------- |
| `serviceName`      | `string`  | Name of your service (used in default logs)                                              |
| `isProduction`     | `boolean` | If true, spawns multiple workers; if false, spawns one                                   |
| `workerModulePath` | `string`  | Absolute path to worker module (use: `new URL('./module.ts', import.meta.url).pathname`) |

### Optional Options

| Option              | Type     | Default | Description                                                         |
| ------------------- | -------- | ------- | ------------------------------------------------------------------- |
| `shutdownTimeoutMs` | `number` | `10000` | How long to wait for graceful shutdown before force-killing workers |

### Lifecycle Callbacks

All callbacks are optional. If not provided, the package logs default messages.

#### Primary Process Callbacks

These run in the **primary/master process** (the one that manages workers):

**`onPrimaryStartup(context)`**

- **When**: After all workers are spawned
- **Context**: `{ workerCount: number }`
- **Use for**: Logging startup info, initializing monitoring

**`onPrimaryShutdown(context)`**

- **When**: SIGTERM/SIGINT received, before killing workers
- **Context**: `{ signal: string }`
- **Use for**: Logging shutdown, final cleanup

**`onWorkerSpawned(context)`**

- **When**: Each time a worker is forked (initial spawn or restart)
- **Context**: `{ workerId: number, pid: number, totalWorkers: number }`
- **Use for**: Tracking worker IDs, metrics

**`onWorkerCrashed(context)`**

- **When**: Worker dies unexpectedly and will be restarted
- **Context**: `{ workerId: number, pid: number, code: number | null, signal: string }`
- **Use for**: Logging crashes, alerting, metrics

**`onWorkerExit(context)`**

- **When**: Worker exits cleanly during graceful shutdown
- **Context**: `{ workerId: number, pid: number }`
- **Use for**: Tracking clean exits

#### Worker Process Callbacks

These run in **each worker process**:

**`onWorkerStartup(context)`**

- **When**: After worker module is successfully imported
- **Context**: `{ workerModule: T, pid: number, workerId: number }`
- **Use for**: Worker-specific initialization, logging

**`onWorkerShutdown(context)`**

- **When**: Worker is shutting down (SIGTERM/SIGINT received)
- **Context**: `{ workerModule: T, pid: number, workerId: number }`
- **Use for**: **Critical cleanup** - close DB connections, message queues, file handles, etc.

## Complete Example

### Server with Database

```typescript
import { startClusteredService } from '@packages/cluster'

import { env } from '@/env'

await startClusteredService<typeof import('./server')>({
  serviceName: 'api-server',
  isProduction: env.NODE_ENV === 'production',
  workerModulePath: new URL('./server.ts', import.meta.url).pathname,
  shutdownTimeoutMs: 15000, // 15 second timeout

  onPrimaryStartup: ({ workerCount }) => {
    console.log(`🚀 Starting ${workerCount} worker(s)`)
    console.log(`🦊 Server running at http://localhost:${env.PORT}`)
  },

  onPrimaryShutdown: ({ signal }) => {
    console.log(`\n${signal} received. Shutting down gracefully...`)
  },

  onWorkerStartup: ({ pid }) => {
    console.log(`Worker ${pid} started`)
  },

  onWorkerCrashed: ({ pid, code, signal }) => {
    console.log(`Worker ${pid} crashed (code: ${code}, signal: ${signal}). Restarting...`)
  },

  onWorkerShutdown: async ({ workerModule }) => {
    // Clean up resources
    await workerModule.app.server?.stop()
    await workerModule.pool.end()
  },
})
```

### Message Queue Worker

```typescript
import { startClusteredService } from '@packages/cluster'

await startClusteredService<typeof import('./worker')>({
  serviceName: 'queue-worker',
  isProduction: process.env.NODE_ENV === 'production',
  workerModulePath: new URL('./worker.ts', import.meta.url).pathname,

  onWorkerShutdown: async ({ workerModule }) => {
    // Close AMQP connections
    await workerModule.channel.close()
    await workerModule.connection.close()
  },
})
```

## How It Works

### Production Mode

1. Primary process spawns N workers (where N = number of CPU cores)
2. Each worker imports and runs your worker module
3. If a worker crashes, primary automatically spawns a replacement
4. On shutdown, primary coordinates graceful shutdown of all workers

### Development Mode

1. Primary process spawns a single worker
2. Worker crashes are still handled with automatic restart
3. Simpler logs and easier debugging

### Startup Failure Protection

If a worker dies within **5 seconds** of starting, it's considered a startup failure. The entire application shuts down to prevent infinite restart loops.

### Graceful Shutdown

1. Primary receives SIGTERM/SIGINT
2. Primary sends SIGTERM to all workers
3. Workers clean up resources (via `onWorkerShutdown`)
4. Workers exit
5. If workers don't exit within timeout, primary force-kills them
6. Primary exits

## Worker Module Requirements

Your worker module should:

1. **Auto-start on import** - Call `.listen()`, `.consume()`, etc. at the module level
2. **Export resources to clean up** - Database pools, connections, channels, etc.

Example worker module:

```typescript
// server.ts
import { Elysia } from 'elysia'

import { pool } from './db'

const app = new Elysia().get('/', () => ({ message: 'Hello' })).listen(3000)

// Export for cleanup
export { app, pool }
```

## Type Safety

Use explicit types for full type safety:

```typescript
await startClusteredService<typeof import('./server')>({
  onWorkerShutdown: async ({ workerModule }) => {
    // workerModule.app and workerModule.pool are fully typed ✅
    await workerModule.app.server?.stop()
    await workerModule.pool.end()
  },
})
```

## See Also

- [apps/server-example/src/index.ts](../../apps/server-example/src/index.ts) - HTTP server example
- [jobs/order-example/src/index.ts](../../jobs/order-example/src/index.ts) - RabbitMQ worker example
