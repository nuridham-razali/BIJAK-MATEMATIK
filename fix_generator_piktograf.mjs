import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

// Update import
code = code.replace(
  'import { generateFractionSvg, generateClockSvg } from "./imageGenerator";',
  'import { generateFractionSvg, generateClockSvg, generatePiktografSvg, generateBarChartSvg } from "./imageGenerator";'
);

code = code.replace(
  "ans = a.toString();\n           text = `Dalam piktograf, satu '⭐' mewakili 1 orang murid.",
  "ans = a.toString();\n           imageUrl = generatePiktografSvg(a, '⭐');\n           text = `Dalam piktograf, satu '⭐' mewakili 1 orang murid."
);

code = code.replace(
  "ans = (a * 5).toString();\n           text = `Satu simbol '⚽' mewakili 5 biji bola.",
  "ans = (a * 5).toString();\n           imageUrl = generatePiktografSvg(a, '⚽');\n           text = `Satu simbol '⚽' mewakili 5 biji bola."
);

code = code.replace(
  "ans = (Math.abs(a - b) * 10).toString();\n           text = `Carta palang:",
  "ans = (Math.abs(a - b) * 10).toString();\n           imageUrl = generateBarChartSvg(a, b);\n           text = `Carta palang:"
);

fs.writeFileSync('src/data/questionGenerator.ts', code);
