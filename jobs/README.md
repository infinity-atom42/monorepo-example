# 🐇 RabbitMQ Settings (Node.js)

This document outlines the recommended settings and usage patterns for RabbitMQ in Node.js services.

---

## ⚙️ Recommended Settings

| Concept           | Node.js Recommendation                                |
| ----------------- | ----------------------------------------------------- |
| **Connection**    | 1 per service / worker                                |
| **Channel**       | 1 per connection is usually sufficient                |
| **Exchange**      | 1 per service (rarely more)                           |
| **Queue**         | 1 per event / stream                                  |
| **Publishing**    | Always publish to exchange → routed to queues         |
| **Multiple Channels** | Only if you have separate workloads needing isolation |

---

## 📤 Publishing Messages

- Always publish **to an exchange**, never directly to a queue.  
- The exchange will **route the message** to one or more queues based on its type and bindings.

---

## 📡 Channels

- Node.js servers are **single-threaded**, so usually **1 channel per service is enough**.  
- In multithreaded apps (e.g., Java, C#):
  - Each process opens **1 connection** and uses multiple channels (1 per thread).
- Multiple channels may be useful to **isolate workloads**:  
  - **Channel 1** → Critical order processing (reliable delivery, publisher confirms).  
  - **Channel 2** → Analytics (high-throughput, fire-and-forget, shouldn’t block orders).  

---

## 🛠️ Migration Script

- **Not required** in most cases.  
- Queues/exchanges are **idempotent** and only disappear if defined as **auto-delete** or **non-durable**.  

---
