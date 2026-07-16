const fs = require('fs');
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

const helpers = `
function getBentukLazim(a: string | number, b: string | number, op: string, ans: string | number): string {
  const strA = a.toString();
  const strB = b.toString();
  const strAns = ans.toString();
  const maxLen = Math.max(strA.length, strB.length, strAns.length) + 1;
  const line = "-".repeat(maxLen + 1);
  return \`\\n\\nKaedah Bentuk Lazim:\\n  \${strA.padStart(maxLen)}\\n\${op} \${strB.padStart(maxLen - 1)}\\n \${line}\\n  \${strAns.padStart(maxLen)}\\n \${line}\`;
}

function getBahagiLazim(dividend: number | string, divisor: number | string, ans: number | string): string {
  const strDiv = dividend.toString();
  const strAns = ans.toString();
  const dLen = strDiv.length;
  const line = "-".repeat(dLen + 1);
  return \`\\n\\nKaedah Pembahagian:\\n    \${strAns.padStart(dLen)}\\n   \${line}\\n \${divisor} )\${strDiv}\`;
}
`;

code = code.replace('export function generateQuestionsForTopic', helpers + '\nexport function generateQuestionsForTopic');

fs.writeFileSync('src/data/questionGenerator.ts', code);
