import fs from 'fs';
let code = fs.readFileSync('src/data/imageGenerator.ts', 'utf8');

code += `
export function generatePiktografSvg(a: number, symbol: string): string {
   let svg = \\\`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 \\\${Math.max(200, a * 30 + 20)} 50'>\\\`;
   for (let i = 0; i < a; i++) {
     svg += \\\`<text x='\\\${i * 30 + 10}' y='35' font-size='24'>\\\${symbol}</text>\\\`;
   }
   svg += \\\`</svg>\\\`;
   return \\\`data:image/svg+xml;base64,\\\${btoa(unescape(encodeURIComponent(svg)))}\\\`;
}

export function generateBarChartSvg(a: number, b: number): string {
   let max = Math.max(a, b);
   let svg = \\\`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 120'>\\\`;
   svg += \\\`<rect x='30' y='\\\${100 - (a/max)*80}' width='30' height='\\\${(a/max)*80}' fill='#ef4444'/>\\\`;
   svg += \\\`<rect x='80' y='\\\${100 - (b/max)*80}' width='30' height='\\\${(b/max)*80}' fill='#3b82f6'/>\\\`;
   svg += \\\`<line x1='10' y1='100' x2='140' y2='100' stroke='#333' stroke-width='2'/>\\\`;
   svg += \\\`<text x='35' y='115' font-size='12'>Merah</text>\\\`;
   svg += \\\`<text x='85' y='115' font-size='12'>Biru</text>\\\`;
   svg += \\\`</svg>\\\`;
   return \\\`data:image/svg+xml;base64,\\\${btoa(unescape(encodeURIComponent(svg)))}\\\`;
}
`;

fs.writeFileSync('src/data/imageGenerator.ts', code);
