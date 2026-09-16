// Build-time configuration is supplied by Cloudflare, never committed.
const fs = require('node:fs');
const path = require('node:path');
const key = process.env.GOOGLE_MAPS_WEB_KEY;
if (!key || !/^AIza[\w-]{35}$/.test(key)) throw new Error('Missing or invalid GOOGLE_MAPS_WEB_KEY');
const source = fs.readFileSync('thailand.html', 'utf8');
const token = '__GOOGLE_MAPS_WEB_KEY__';
if (source.split(token).length !== 2) throw new Error('Expected exactly one map configuration placeholder');
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync(path.join('dist', 'thailand.html'), source.replace(token, key));
fs.copyFileSync('index.html', path.join('dist', 'index.html'));
fs.writeFileSync(path.join('dist', '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
console.log('Static site built successfully.');
