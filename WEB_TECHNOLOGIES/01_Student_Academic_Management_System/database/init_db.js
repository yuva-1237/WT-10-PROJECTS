const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.sql');
const dataPath = path.join(__dirname, '..', 'data', 'initial_data.json');

console.log('--- Initializing Database for Project 01 ---');
if (fs.existsSync(schemaPath) && fs.existsSync(dataPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Loaded schema (${schema.length} bytes)`);
  console.log(`Found ${data.students.length} seed students and ${data.subjects.length} subjects.`);
  console.log('Database initialization check: OK');
} else {
  console.error('Error: schema or data files missing.');
  process.exit(1);
}
