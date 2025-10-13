import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { env } from '@se/env'

const pool = new Pool({
	connectionString: env.AUTH_DATABASE_URL,
})
const db = drizzle({ client: pool })

export default db
