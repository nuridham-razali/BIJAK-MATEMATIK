import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

// Add import
code = code.replace(
  'import { shapes2D as svg2D, shapes3D as svg3D } from "./shapeSvgs";',
  'import { shapes2D as svg2D, shapes3D as svg3D } from "./shapeSvgs";\nimport { generateFractionSvg, generateClockSvg } from "./imageGenerator";'
);

// We need to add imageUrl for all questions where it's not defined
code = code.replace(
  'let options: string[] | undefined;',
  'let options: string[] | undefined;\n    let imageUrl: string | undefined;'
);

code = code.replace(
  'correctAnswerIndex: options.indexOf(ans), explanation',
  'correctAnswerIndex: options.indexOf(ans), explanation, imageUrl'
);
// replace multiple occurrences if needed, but it's safer to use a regex
fs.writeFileSync('src/data/questionGenerator.ts', code);
