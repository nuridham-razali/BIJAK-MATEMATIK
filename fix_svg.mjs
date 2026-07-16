import fs from 'fs';

const raw2D = {
  "Segi empat sama": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='10' y='10' width='80' height='80' fill='#60a5fa' stroke='#2563eb' stroke-width='4'/></svg>",
  "Segi empat tepat": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='5' y='25' width='90' height='50' fill='#60a5fa' stroke='#2563eb' stroke-width='4'/></svg>",
  "Segi tiga": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,15 90,85 10,85' fill='#60a5fa' stroke='#2563eb' stroke-width='4'/></svg>"
};

const raw3D = {
  "Kubus": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M25,25 L75,25 L75,75 L25,75 Z' fill='#93c5fd' stroke='#2563eb' stroke-width='4'/><path d='M25,25 L40,10 L90,10 L75,25 Z' fill='#bfdbfe' stroke='#2563eb' stroke-width='4'/><path d='M75,25 L90,10 L90,60 L75,75 Z' fill='#60a5fa' stroke='#2563eb' stroke-width='4'/></svg>",
  "Kuboid": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M15,35 L85,35 L85,85 L15,85 Z' fill='#93c5fd' stroke='#2563eb' stroke-width='4'/><path d='M15,35 L30,15 L100,15 L85,35 Z' fill='#bfdbfe' stroke='#2563eb' stroke-width='4'/><path d='M85,35 L100,15 L100,65 L85,85 Z' fill='#60a5fa' stroke='#2563eb' stroke-width='4'/></svg>",
  "Piramid": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,10 20,80 80,80' fill='#93c5fd' stroke='#2563eb' stroke-width='4'/><polygon points='50,10 80,80 95,65' fill='#60a5fa' stroke='#2563eb' stroke-width='4'/><polygon points='20,80 80,80 95,65 35,65' fill='none' stroke='#2563eb' stroke-width='2' stroke-dasharray='4,4'/></svg>",
  "Silinder": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><ellipse cx='50' cy='20' rx='30' ry='10' fill='#bfdbfe' stroke='#2563eb' stroke-width='4'/><path d='M20,20 L20,80 A30,10 0 0,0 80,80 L80,20' fill='#93c5fd' stroke='#2563eb' stroke-width='4'/><ellipse cx='50' cy='80' rx='30' ry='10' fill='none' stroke='#2563eb' stroke-width='4' stroke-dasharray='4,4'/></svg>"
};

let out = `export const shapes2D = {\n`;
for(const [k, v] of Object.entries(raw2D)) {
  out += `  "${k}": "data:image/svg+xml;base64,${Buffer.from(v).toString('base64')}",\n`;
}
out += `};\n\nexport const shapes3D = {\n`;
for(const [k, v] of Object.entries(raw3D)) {
  out += `  "${k}": "data:image/svg+xml;base64,${Buffer.from(v).toString('base64')}",\n`;
}
out += `};\n`;

fs.writeFileSync('src/data/shapeSvgs.ts', out);
