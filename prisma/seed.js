import 'dotenv/config';
import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Client } = pkg;
const url = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DATABASE_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const client = new Client({
  connectionString: url,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  await client.connect();

  const email = 'admin@test.com';

  const existing = await client.query(
    'SELECT * FROM "User" WHERE email = $1',
    [email]
  );

  if (existing.rows.length > 0) {
    console.log('Admin already exists');
    await client.end();
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await client.query(
    `
    INSERT INTO "User" (id, name, email, password, role, "createdAt")
    VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
    `,
    ['Super Admin', email, hashedPassword, 'ADMIN']
  );

  console.log('✅ Admin created: admin@test.com / Admin@123');

  await client.end();
}

main().catch(console.error);