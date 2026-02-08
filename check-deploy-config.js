#!/usr/bin/env node
// check-deploy-config.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Kiểm tra cấu hình deploy...');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'vercel.json',
  'src/config/apiConfig.js',
  'api/orders/create.js',
  'api/orders/my-orders.js'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.log(`❌ Thiếu tệp: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Có tệp: ${file}`);
  }
}

// Check if .env.example has required variables
if (fs.existsSync(path.join(__dirname, '.env.example'))) {
  const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
  
  const requiredEnvVars = [
    'VITE_GOOGLE_CLIENT_ID',
    'MONGODB_URI',
    'SESSION_SECRET',
    'JWT_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];
  
  console.log('\n📋 Kiểm tra biến môi trường trong .env.example:');
  for (const varName of requiredEnvVars) {
    if (envExample.includes(varName)) {
      console.log(`✅ Có biến: ${varName}`);
    } else {
      console.log(`❌ Thiếu biến: ${varName}`);
      allFilesExist = false;
    }
  }
} else {
  console.log('❌ Thiếu tệp: .env.example');
  allFilesExist = false;
}

// Check if Vercel Functions exist
const apiDir = path.join(__dirname, 'api');
if (fs.existsSync(apiDir)) {
  const apiFiles = fs.readdirSync(apiDir);
  console.log('\n📁 Kiểm tra Vercel Functions:');
  
  const requiredFunctions = ['orders'];
  for (const func of requiredFunctions) {
    if (apiFiles.includes(func)) {
      console.log(`✅ Có thư mục: api/${func}/`);
      
      // Check if create function exists
      const funcDir = path.join(apiDir, func);
      if (fs.existsSync(funcDir)) {
        const funcFiles = fs.readdirSync(funcDir);
        if (funcFiles.includes('create.js')) {
          console.log(`✅ Có function: api/${func}/create.js`);
        } else {
          console.log(`❌ Thiếu function: api/${func}/create.js`);
          allFilesExist = false;
        }
      }
    } else {
      console.log(`❌ Thiếu thư mục: api/${func}/`);
      allFilesExist = false;
    }
  }
} else {
  console.log('❌ Thiếu thư mục: api/');
  allFilesExist = false;
}

// Check package.json scripts
if (fs.existsSync(path.join(__dirname, 'package.json'))) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  console.log('\n📦 Kiểm tra scripts trong package.json:');
  const requiredScripts = ['build', 'dev', 'vercel-build'];
  
  for (const script of requiredScripts) {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Có script: ${script}`);
    } else {
      console.log(`⚠️ Thiếu script: ${script}`);
    }
  }
}

console.log('\n🏁 Kết quả kiểm tra:');
if (allFilesExist) {
  console.log('✅ Tất cả cấu hình cần thiết đã sẵn sàng cho deploy!');
  console.log('\n🚀 Bạn có thể deploy lên Vercel bằng lệnh:');
  console.log('   vercel --prod');
  console.log('\n🐳 Hoặc build Docker bằng lệnh:');
  console.log('   npm run docker:build-frontend');
  console.log('   npm run docker:build-backend');
} else {
  console.log('❌ Một số cấu hình còn thiếu, vui lòng kiểm tra lại!');
  process.exit(1);
}