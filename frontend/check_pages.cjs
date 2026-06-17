const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap(f => {
    const p = path.join(dir, f);
    return fs.statSync(p).isDirectory() ? walk(p) : [p];
  });
};

const files = walk('src/pages').filter(f => f.endsWith('.jsx'));

console.log('=== PAGE AUDIT REPORT ===\n');

files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  const hasAPI = code.includes('api.') || code.includes('fetch(') || code.includes('axios');
  const hasHardcode = 
    code.includes('Rahul') || 
    code.includes('lorem') ||
    code.includes('dummy') ||
    code.includes('9876543210') ||
    code.includes('example@') ||
    (code.includes('setTimeout') && !hasAPI);
  
  const name = f.replace('src\\pages\\', '').replace('src/pages/', '');
  
  if (!hasAPI && hasHardcode) {
    console.log('❌ HARDCODED + NO API : ' + name);
  } else if (!hasAPI) {
    console.log('⚠️  NO API CALLS      : ' + name);
  } else if (hasHardcode) {
    console.log('⚠️  HAS HARDCODE      : ' + name);
  } else {
    console.log('✅ OK                 : ' + name);
  }
});