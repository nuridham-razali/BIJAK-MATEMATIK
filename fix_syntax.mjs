import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

code = code.replace(
  '} else if (activeCategory === "nombor_bulat") {',
  'if (activeCategory === "nombor_bulat") {'
);

fs.writeFileSync('src/data/questionGenerator.ts', code);
