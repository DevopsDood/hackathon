#!/usr/bin/env node

// ShadowPay CLI entry point
const path = require('path');
const { execSync } = require('child_process');

const distPath = path.join(__dirname, '..', 'dist');

try {
  require(distPath + '/index.js');
} catch (e) {
  console.log('Building ShadowPay CLI...');
  try {
    execSync('cd ' + path.join(__dirname, '..') + ' && npm run build', { stdio: 'inherit' });
    require(distPath + '/index.js');
  } catch (err) {
    console.error('Failed to build CLI:', err.message);
    process.exit(1);
  }
}
