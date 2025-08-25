import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema.js';

export default drizzle(process.env.DATABASE_URL!, { schema, casing: 'snake_case' })
