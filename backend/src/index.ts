import* as dotenv from "dotenv"
dotenv.config(); // Call this at the top of your file

import { Client } from 'pg';

console.log(process.env.DATABASE_URL  
)

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));
