export function formatTambah(a: string, b: string): string {
  const maxLen = Math.max(a.length, b.length) + 1;
  const ans = (parseFloat(a.replace(/[^\d.]/g, '')) + parseFloat(b.replace(/[^\d.]/g, ''))).toString();
  
  // Format for padding depending on strings, just simple right align
  return `  ${a.padStart(maxLen)}\n+ ${b.padStart(maxLen)}\n${"-".repeat(maxLen + 2)}\n  ${ans.padStart(maxLen)}\n${"-".repeat(maxLen + 2)}`;
}
