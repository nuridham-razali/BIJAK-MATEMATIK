import fs from 'fs';

// 1. Update vite.config.ts base
let viteCode = fs.readFileSync('vite.config.ts', 'utf8');
if (!viteCode.includes('base:')) {
  viteCode = viteCode.replace(
    'export default defineConfig(() => {',
    'export default defineConfig(() => {\n  const isGitHubPages = process.env.GITHUB_ACTIONS === "true";\n'
  );
  viteCode = viteCode.replace(
    'plugins: [react(), tailwindcss()],',
    'base: isGitHubPages ? "/BIJAK-MATEMATIK/" : "/",\n    plugins: [react(), tailwindcss()],'
  );
  fs.writeFileSync('vite.config.ts', viteCode);
}

// 2. Update App.tsx to use HashRouter
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace('import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";', 'import { HashRouter, Routes, Route, Navigate } from "react-router-dom";');
appCode = appCode.replace('<BrowserRouter>', '<HashRouter>');
appCode = appCode.replace('</BrowserRouter>', '</HashRouter>');
fs.writeFileSync('src/App.tsx', appCode);

console.log("Done");
