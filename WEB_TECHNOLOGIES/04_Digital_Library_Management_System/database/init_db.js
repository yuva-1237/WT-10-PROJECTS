const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.sql');
const dataPath = path.join(__dirname, '..', 'data', 'initial_data.json');

console.log('--- Initializing Database for Project 04 ---');
if (fs.existsSync(schemaPath) && fs.existsSync(dataPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Loaded schema (${schema.length} bytes)`);
  console.log(`Library: ${data.libraryName}`);
  console.log(`Found ${data.books.length} cataloged titles and ${data.issues.length} issue transactions.`);
  console.log('Database initialization check: OK');
} else {
  console.error('Error: schema or data files missing.');
  process.exit(1);
}
