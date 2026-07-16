import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

code = code.replace(
  'const availableTypes = [];\n      if (title.includes("panjang")) availableTypes.push(1);\n      if (title.includes("jisim") || title.includes("berat")) availableTypes.push(2);\n      if (title.includes("isipadu")) availableTypes.push(3);\n      if (title.includes("ruang") || title.includes("bentuk")) availableTypes.push(4);',
  'const availableTypes = [];\n      const tDesc = title + " " + desc;\n      if (tDesc.includes("panjang")) availableTypes.push(1);\n      if (tDesc.includes("jisim") || tDesc.includes("berat")) availableTypes.push(2);\n      if (tDesc.includes("isipadu") || tDesc.includes("cecair")) availableTypes.push(3);\n      if (tDesc.includes("ruang") || tDesc.includes("bentuk") || tDesc.includes("perimeter") || tDesc.includes("luas")) availableTypes.push(4);'
);

fs.writeFileSync('src/data/questionGenerator.ts', code);
