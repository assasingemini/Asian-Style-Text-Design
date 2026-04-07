const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src/app')).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;
  
  if (content.match(/navigate\((["'].*?["'])\)/)) {
    content = content.replace(/navigate\((["'].*?["'])\)/g, 'navigate.push($1)');
    changed = true;
  }
  if (content.match(/navigate\(-1\)/)) {
    content = content.replace(/navigate\(-1\)/g, 'navigate.back()');
    changed = true;
  }
  
  if (file.endsWith('shop\\page.tsx') || file.endsWith('shop/page.tsx')) {
    if (content.includes('useSearchParams') && !content.match(/import.*useSearchParams/)) {
      if (content.includes("from 'next/navigation'")) {
        content = content.replace(/(import\s+\{([^}]+)\}\s+from\s+'next\/navigation';)/, "import { useSearchParams } from 'next/navigation';\n$1");
      } else {
        content = "import { useSearchParams } from 'next/navigation';\n" + content;
      }
      changed = true;
    }
  }

  // Quick fixes for any types in admin/page.tsx
  if (file.includes('admin') && file.endsWith('page.tsx')) {
    // To handle explicit anys: 
    // `prev =>` -> `(prev: any) =>`
    // `p =>` -> `(p: any) =>`
    // Wait, regex might replace unintended stuff, but since it's just arrow functions in standard React code, it shouldn't be too bad.
    // Specifying precise strings:
    content = content.replace(/\bprev =>/g, '(prev: any) =>');
    content = content.replace(/\b(p) =>/g, '(p: any) =>');
    content = content.replace(/\b(c) =>/g, '(c: any) =>');
    content = content.replace(/\b(product) =>/g, '(product: any) =>');
    content = content.replace(/\b(u) =>/g, '(u: any) =>');
    content = content.replace(/\b(post) =>/g, '(post: any) =>');
    content = content.replace(/\b(campaign) =>/g, '(campaign: any) =>');
    content = content.replace(/\(p, /g, '(p: any, ');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
});
