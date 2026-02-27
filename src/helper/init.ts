require('dotenv').config();
const fs = require('fs-extra');

try {
  const reportDir = process.env.REPORT_DIR || 'test-results';
  fs.ensureDir(reportDir);
  fs.emptyDir(reportDir);
} catch (error) {
  console.log('Folder not created! + error');
}
