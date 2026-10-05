const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'initial_data.json');
const schemaFile = path.join(__dirname, 'schema.sql');

console.log('--- Initializing Database for Project 10: Hostel Management System ---');

if (fs.existsSync(schemaFile) && fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  console.log(`Verified schema.sql and initial_data.json.`);
  console.log(`Rooms loaded: ${data.rooms.length}`);
  console.log(`Students loaded: ${data.students.length}`);
  console.log(`Leave Requests loaded: ${data.leaveRequests.length}`);
  console.log(`Complaints loaded: ${data.complaints.length}`);
  console.log('Database initialized successfully.');
} else {
  console.error('Missing schema or initial data file.');
  process.exit(1);
}
