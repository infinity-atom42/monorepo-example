import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { serverEnv } from '@/env'

const pool = new Pool({
	connectionString: serverEnv.AUTH_DATABASE_URL,
})
const db = drizzle({ client: pool })

export default db
