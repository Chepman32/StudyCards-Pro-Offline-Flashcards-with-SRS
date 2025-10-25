import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';

const db = open({ name: 'studycards.db' });

export const database = drizzle(db);

export { db };
