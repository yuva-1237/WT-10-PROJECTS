const path = require('path');
const { execSync } = require('child_process');

const projects = [
  '01_Student_Academic_Management_System',
  '02_Online_Examination_System',
  '03_Hospital_Appointment_Management_System',
  '04_Digital_Library_Management_System',
  '05_College_Bus_Tracking_Pass_System',
  '06_Internship_Job_Application_Portal',
  '07_College_Canteen_Pre_Order_System',
  '08_College_Complaint_Maintenance_Portal',
  '09_College_Event_Registration_System',
  '10_Hostel_Management_System'
];

let totalPassed = 0;
let totalFailed = 0;

console.log('================================================================');
console.log('  RUNNING COMPLETE VERIFICATION ON ALL 10 PROJECTS');
console.log('================================================================');

projects.forEach((proj, idx) => {
  const testFile = path.join(__dirname, proj, 'tests', 'test.js');
  try {
    const out = execSync(`node "${testFile}"`, { encoding: 'utf-8' });
    console.log(`[PASS] Project ${(idx + 1).toString().padStart(2, '0')}: ${proj}`);
    totalPassed++;
  } catch (err) {
    console.error(`[FAIL] Project ${(idx + 1).toString().padStart(2, '0')}: ${proj}`);
    console.error(err.stdout || err.message);
    totalFailed++;
  }
});

console.log('================================================================');
console.log(`Summary: ${totalPassed} Projects Passed, ${totalFailed} Failed.`);
console.log('================================================================');
if (totalFailed > 0) process.exit(1);
