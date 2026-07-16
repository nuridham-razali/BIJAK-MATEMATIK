import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

// We know `text` and `explanation` are missing. 
// We will just add them properly right after `const difficulty = ...;`
code = code.replace(
  'const difficulty = i < 10 ? "mudah" : i < 20 ? "sederhana" : "kbat";',
  'const difficulty = i < 10 ? "mudah" : i < 20 ? "sederhana" : "kbat";\n    let text = "";\n    let explanation = "";'
);

// We should also replace `let text = "";` that might have been removed... wait, it's already removed!
// We can just write back.
fs.writeFileSync('src/data/questionGenerator.ts', code);
