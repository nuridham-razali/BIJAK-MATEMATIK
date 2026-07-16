export function generateFractionSvg(a: number, den: number): string {
  let svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${den * 50} 50'>`;
  for (let i = 0; i < den; i++) {
    svg += `<rect x='${i * 50}' y='0' width='50' height='50' fill='${i < a ? "#4ade80" : "#fff"}' stroke='#22c55e' stroke-width='2'/>`;
  }
  svg += `</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function generateClockSvg(h: number, m: number): string {
  let svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>`;
  svg += `<circle cx='50' cy='50' r='45' fill='#fff' stroke='#333' stroke-width='4'/>`;
  for(let i=0; i<12; i++) {
     let angle = (i * 30 - 90) * Math.PI / 180;
     let x1 = 50 + 35 * Math.cos(angle);
     let y1 = 50 + 35 * Math.sin(angle);
     let x2 = 50 + 40 * Math.cos(angle);
     let y2 = 50 + 40 * Math.sin(angle);
     svg += `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='#333' stroke-width='2'/>`;
  }
  let hAngle = ((h % 12 + m/60) * 30 - 90) * Math.PI / 180;
  let mAngle = (m * 6 - 90) * Math.PI / 180;
  svg += `<line x1='50' y1='50' x2='${50 + 20 * Math.cos(hAngle)}' y2='${50 + 20 * Math.sin(hAngle)}' stroke='#333' stroke-width='4' stroke-linecap='round'/>`;
  svg += `<line x1='50' y1='50' x2='${50 + 30 * Math.cos(mAngle)}' y2='${50 + 30 * Math.sin(mAngle)}' stroke='#666' stroke-width='3' stroke-linecap='round'/>`;
  svg += `<circle cx='50' cy='50' r='3' fill='#333'/>`;
  svg += `</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function generatePiktografSvg(a: number, symbol: string): string {
   let svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${Math.max(200, a * 30 + 20)} 50'>`;
   for (let i = 0; i < a; i++) {
     svg += `<text x='${i * 30 + 10}' y='35' font-size='24'>${symbol}</text>`;
   }
   svg += `</svg>`;
   return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export function generateBarChartSvg(a: number, b: number): string {
   let max = Math.max(a, b);
   let svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 120'>`;
   svg += `<rect x='30' y='${100 - (a/max)*80}' width='30' height='${(a/max)*80}' fill='#ef4444'/>`;
   svg += `<rect x='80' y='${100 - (b/max)*80}' width='30' height='${(b/max)*80}' fill='#3b82f6'/>`;
   svg += `<line x1='10' y1='100' x2='140' y2='100' stroke='#333' stroke-width='2'/>`;
   svg += `<text x='35' y='115' font-size='12'>Merah</text>`;
   svg += `<text x='85' y='115' font-size='12'>Biru</text>`;
   svg += `</svg>`;
   return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}
