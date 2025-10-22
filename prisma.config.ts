import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
	schema: 'src/libs/prisma/schema.prisma',
	migrations: {
		path: 'src/libs/prisma/migrations',
	},
	engine: 'classic',
	datasource: {
		url: env('DATABASE_URL'),
	},
});
