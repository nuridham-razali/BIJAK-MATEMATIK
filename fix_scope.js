const fs = require('fs');
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

// Add the declarations at the top of the loop
code = code.replace(
  'for (let i = 0; i < 30; i++) {',
  'for (let i = 0; i < 30; i++) {\n    let text = "";\n    let ans = "";\n    let explanation = "";\n    let options: string[] | undefined;'
);

// Remove local declarations
code = code.replace(/let text = "";/g, '');
code = code.replace(/let ans = "";/g, '');
code = code.replace(/let explanation = "";/g, '');
code = code.replace(/let options;/g, '');

fs.writeFileSync('src/data/questionGenerator.ts', code);
