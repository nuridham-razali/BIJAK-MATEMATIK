import fs from 'fs';
let code = fs.readFileSync('src/data/questionGenerator.ts', 'utf8');

// Add isNomborBulat checker
code = code.replace(
  'const isPecahan = title.includes("pecahan");',
  'const isPecahan = title.includes("pecahan");\n  const isNomborBulat = title.includes("nombor bulat");'
);

// Add to possibleCats
code = code.replace(
  'if (isPecahan) possibleCats.push("pecahan");',
  'if (isPecahan) possibleCats.push("pecahan");\n    if (isNomborBulat) possibleCats.push("nombor_bulat");'
);

// Add block in loop
const insertBlock = `} else if (activeCategory === "nombor_bulat") {
      let maxNum = 100;
      if (year === 1) maxNum = 100;
      else if (year === 2) maxNum = 1000;
      else if (year === 3) maxNum = 10000;
      else if (year === 4) maxNum = 100000;
      else if (year === 5) maxNum = 1000000;
      else maxNum = 10000000;

      const type = rand(1, 3);
      if (type === 1) { // Nilai tempat
        const num = rand(Math.floor(maxNum/10), maxNum - 1);
        const numStr = num.toString();
        const pos = rand(0, numStr.length - 1);
        const digit = numStr[pos];
        const places = ["sa", "puluh", "ratus", "ribu", "puluh ribu", "ratus ribu", "juta"];
        const placeIdx = numStr.length - 1 - pos;
        ans = places[placeIdx];
        text = \`Apakah nilai tempat bagi digit \${digit} dalam nombor \${num}?\`;
        let opts = [places[Math.max(0, placeIdx - 1)], places[placeIdx], places[Math.min(places.length - 1, placeIdx + 1)], places[Math.min(places.length - 1, placeIdx + 2)]].sort(() => Math.random() - 0.5);
        opts = [...new Set(opts)];
        while (opts.length < 4) {
          const p = places[rand(0, Math.min(places.length - 1, numStr.length - 1))];
          if (!opts.includes(p)) opts.push(p);
        }
        options = opts.sort(() => Math.random() - 0.5);
        explanation = \`Digit \${digit} berada di kedudukan \${places[placeIdx]}.\`;
      } else if (type === 2) { // Nilai digit
         const num = rand(Math.floor(maxNum/10), maxNum - 1);
         const numStr = num.toString();
         const pos = rand(0, numStr.length - 1);
         const digit = numStr[pos];
         const placeIdx = numStr.length - 1 - pos;
         ans = (parseInt(digit) * Math.pow(10, placeIdx)).toString();
         text = \`Apakah nilai digit bagi \${digit} dalam nombor \${num}?\`;
         let opts = [
           (parseInt(digit) * Math.pow(10, placeIdx)).toString(),
           (parseInt(digit) * Math.pow(10, Math.max(0, placeIdx - 1))).toString(),
           (parseInt(digit) * Math.pow(10, Math.min(6, placeIdx + 1))).toString(),
           (parseInt(digit) * Math.pow(10, Math.min(6, placeIdx + 2))).toString()
         ];
         opts = [...new Set(opts)];
         while (opts.length < 4) {
           opts.push((parseInt(digit) * Math.pow(10, rand(0, 6))).toString());
           opts = [...new Set(opts)];
         }
         options = opts.sort(() => Math.random() - 0.5);
         explanation = \`Nilai digit bagi \${digit} di kedudukan tersebut ialah \${ans}.\`;
      } else { // Bundar
         const num = rand(Math.floor(maxNum/10), maxNum - 1);
         const places = ["puluh", "ratus", "ribu", "puluh ribu", "ratus ribu"];
         const validPlaces = places.slice(0, num.toString().length - 1);
         const place = validPlaces.length > 0 ? validPlaces[rand(0, validPlaces.length - 1)] : "puluh";
         
         let divider = 10;
         if (place === "ratus") divider = 100;
         if (place === "ribu") divider = 1000;
         if (place === "puluh ribu") divider = 10000;
         if (place === "ratus ribu") divider = 100000;

         const rounded = Math.round(num / divider) * divider;
         ans = rounded.toString();
         text = \`Bundarkan \${num} kepada \${place} yang terdekat.\`;
         let opts = [
           rounded.toString(),
           (Math.floor(num / divider) * divider).toString(),
           (Math.ceil(num / divider) * divider).toString(),
           (rounded + divider).toString()
         ];
         opts = [...new Set(opts)];
         while (opts.length < 4) {
           opts.push((Math.round((num + rand(-5, 5)*divider) / divider) * divider).toString());
           opts = [...new Set(opts)];
         }
         options = opts.sort(() => Math.random() - 0.5);
         explanation = \`Jika digit sebelah kanan nombor yang dibundarkan adalah 5 atau lebih, tambah 1 kepada nombor tersebut. Jawapannya ialah \${ans}.\`;
      }
      
      addQuestion({ difficulty, text, options, correctAnswerIndex: options.indexOf(ans), explanation, imageUrl });
    `;

code = code.replace(
  'if (activeCategory === "pecahan") {',
  insertBlock + '\n    } else if (activeCategory === "pecahan") {'
);

fs.writeFileSync('src/data/questionGenerator.ts', code);
