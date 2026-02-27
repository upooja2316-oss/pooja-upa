const dotenv = require('dotenv');
dotenv.config();

export const env = {
  URL: process.env.URL || 'https://www.amazon.com/',  
  BASE_URL: process.env.BASE_URL || 'https://bookcart.azurewebsites.net/',
  DEFAULT_USERNAME: process.env.DEFAULT_USERNAME || 'ortoni',
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD || 'Pass1234',
  REPORT_DIR: process.env.REPORT_DIR || 'test-results',
  HEADLESS: process.env.HEADLESS === 'true',
};
