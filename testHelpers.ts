export function getBentukLazim(a: string | number, b: string | number, op: string, ans: string | number): string {
  const strA = a.toString();
  const strB = b.toString();
  const strAns = ans.toString();
  
  // padding
  const maxLen = Math.max(strA.length, strB.length, strAns.length) + 1;
  const line = "-".repeat(maxLen + 1);
  
  return `Kaedah Bentuk Lazim:\n  ${strA.padStart(maxLen)}\n${op} ${strB.padStart(maxLen - 1)}\n ${line}\n  ${strAns.padStart(maxLen)}\n ${line}`;
}
console.log(getBentukLazim(125, 45, '+', 170));
console.log(getBentukLazim(35, 6, '×', 210));
console.log(getBentukLazim('RM120', 'RM50', '-', 'RM70'));
