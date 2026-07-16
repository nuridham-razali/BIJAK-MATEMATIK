import fs from 'fs';
let code = fs.readFileSync('src/data/imageGenerator.ts', 'utf8');

code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/data/imageGenerator.ts', code);
