import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

// Remove outer addQuestion
code = code.replace(
  'const addQuestion = (q: Omit<Question, "id">) => {\n    questions.push({ ...q, id: `q_${topicId}_${questions.length + 1}` });\n  };',
  ''
);

// Add inner addQuestion
code = code.replace(
  'let imageUrl: string | undefined;',
  'let imageUrl: string | undefined;\n    const addQuestion = (q: Omit<Question, "id">) => {\n      questions.push({ imageUrl, ...q, id: `q_${topicId}_${questions.length + 1}` });\n    };'
);

fs.writeFileSync('src/data/questionGenerator.ts', code);
