import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');
code = code.replace(
  'const h1 = rand(1, 10);\n      imageUrl = generateClockSvg(h1, m1);\n      const m1 = rand(10, 50);',
  'const h1 = rand(1, 10);\n      const m1 = rand(10, 50);\n      imageUrl = generateClockSvg(h1, m1);'
);
fs.writeFileSync('src/data/questionGenerator.ts', code);
