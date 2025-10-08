# 🔐 Environment Variables

This monorepo uses **`.env` files** to manage configuration for different environments across packages.

---

## 📋 `.env` Files Overview

| File                     | Purpose                                                  | Committed to Git? |
| ------------------------ | -------------------------------------------------------- | ----------------- |
| `.env`                   | Default variables used in all environments (non-secret)  | ✅ Yes            |
| `.env.development`       | Development environment variables shared across the team | ✅ Yes            |
| `.env.test`              | Test environment variables                               | ✅ Yes            |
| `.env.production`        | Production defaults (non-secret, safe to commit)         | ✅ Yes            |
| `.env.local`             | Local secrets (API keys, DB passwords)                   | ❌ **No**         |
| `.env.development.local` | Overrides development variables on your machine          | ❌ **No**         |
| `.env.production.local`  | Production secrets for deployment (e.g., server keys)    | ❌ **No**         |

> ⚠️ **Important:** `.local` files are **never committed** to Git. Use them for secrets or machine-specific overrides.

---

## 📚 Usage Notes for Monorepo

✨ **Best Practices:**

- Each package/app can have its own set of `.env` files
- Shared defaults (committed `.env` files) should be placed at the **root of each package**
- Local secrets (`.local`) should be created by each developer for their machine
- **Never commit `.local` files to Git** — add them to `.gitignore`

---

## 📄 Example Files

💡 **Reminder:** Use `.example` files as templates (e.g., `.env.development.local.example` → `.env.development.local`)

---

## 🛡️ Security Reminder

🔒 **Always keep secrets in `.local` files**  
🚫 **Never commit sensitive data** (API keys, passwords, tokens)  
✅ **Use placeholder values** in committed `.env` files for documentation
