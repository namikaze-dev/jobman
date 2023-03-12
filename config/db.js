import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dsn = process.env.DSN;
const client = new pg.Client(dsn);

client.on('connect', () => {
    console.log('db connect success');
});

await client.connect();


export default client;