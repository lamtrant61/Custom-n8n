// DbConnection.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let pool: Pool | null = null;

export const poolConnection = () => {
	// console.log(process.env, 'poolConnection')
	if (!pool) {
		pool = new Pool({
			host: process.env.DB_POSTGRESDB_HOST,
			port: Number(process.env.DB_POSTGRESDB_PORT),
			user: process.env.DB_POSTGRESDB_USER,
			password: process.env.DB_POSTGRESDB_PASSWORD,
			database: process.env.DB_POSTGRESDB_DATABASE,
			max: 5, // số connection tối đa trong pool
			idleTimeoutMillis: 30000, // timeout idle
		});
		console.log('PostgreSQL connection pool created');
	}
	return pool;
};
