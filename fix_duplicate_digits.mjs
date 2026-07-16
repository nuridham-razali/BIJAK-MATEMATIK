import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

const replaceLogic = `const initialNum = rand(Math.floor(maxNum/10), maxNum - 1);
        let numStr = initialNum.toString();
        const pos = rand(0, numStr.length - 1);
        const digit = numStr[pos];
        let newNumStr = "";
        for (let j = 0; j < numStr.length; j++) {
           if (j !== pos && numStr[j] === digit) {
              let d = (parseInt(digit) + rand(1, 8)) % 10;
              if (j === 0 && d === 0) d = 1;
              newNumStr += d.toString();
           } else {
              newNumStr += numStr[j];
           }
        }
        numStr = newNumStr;
        const num = parseInt(numStr);`;

code = code.replace(
  'const num = rand(Math.floor(maxNum/10), maxNum - 1);\n        const numStr = num.toString();\n        const pos = rand(0, numStr.length - 1);\n        const digit = numStr[pos];',
  replaceLogic
);

code = code.replace(
  'const num = rand(Math.floor(maxNum/10), maxNum - 1);\n         const numStr = num.toString();\n         const pos = rand(0, numStr.length - 1);\n         const digit = numStr[pos];',
  replaceLogic
);

fs.writeFileSync('src/data/questionGenerator.ts', code);
