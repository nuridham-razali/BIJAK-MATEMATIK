import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

// Replace all instances of `explanation` being the last property in `addQuestion`
// It usually looks like `explanation }` or `explanation\n      }` or `explanation\n    }`
code = code.replace(/explanation:([^,}]+)(?=\s*\}\s*\))/g, 'explanation:$1, imageUrl');
code = code.replace(/explanation(?=\s*\}\s*\))/g, 'explanation, imageUrl');
code = code.replace(/imageUrl, imageUrl/g, 'imageUrl');

// Also update fractions to use generateFractionSvg
code = code.replace(
  'ans = `${a + b}/${den}`;',
  'imageUrl = generateFractionSvg(a + b, den);\n        ans = `${a + b}/${den}`;'
);
code = code.replace(
  'ans = `${big - small}/${den}`;',
  'imageUrl = generateFractionSvg(big - small, den);\n        ans = `${big - small}/${den}`;'
);
code = code.replace(
  'ans = `${whole * a}/${den}`;',
  'imageUrl = generateFractionSvg(whole * a, den);\n        ans = `${whole * a}/${den}`;'
);

// Also update time to use generateClockSvg
code = code.replace(
  'const h1 = rand(1, 10);',
  'const h1 = rand(1, 10);\n      imageUrl = generateClockSvg(h1, rand(0, 59));'
);

fs.writeFileSync('src/data/questionGenerator.ts', code);
