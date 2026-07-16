import { Question } from "@/types";
import { TOPICS } from "./topics";
import { shapes2D as svg2D, shapes3D as svg3D } from "./shapeSvgs";
import { generateFractionSvg, generateClockSvg, generatePiktografSvg, generateBarChartSvg } from "./imageGenerator";

function getBentukLazim(a: string | number, b: string | number, op: string, ans: string | number): string {
  const strA = a.toString();
  const strB = b.toString();
  const strAns = ans.toString();
  const maxLen = Math.max(strA.length, strB.length, strAns.length) + 1;
  const line = "-".repeat(maxLen + 1);
  return `\n\nKaedah Bentuk Lazim (Adimatik):\n   ${strA.padStart(maxLen)}\n${op}  ${strB.padStart(maxLen - 1)}\n  ${line}\n   ${strAns.padStart(maxLen)}\n  ${line}`;
}

function getBahagiLazim(dividend: number | string, divisor: number | string, ans: number | string): string {
  const strDiv = dividend.toString();
  const strAns = ans.toString();
  const dLen = strDiv.length;
  const line = "-".repeat(dLen + 1);
  return `\n\nKaedah Pembahagian (Adimatik):\n     ${strAns.padStart(dLen)}\n    ${line}\n  ${divisor} ) ${strDiv}`;
}

export function generateQuestionsForTopic(topicId: string, year: number): Question[] {
  const questions: Question[] = [];
  
  

  const topic = TOPICS.find(t => t.id === topicId);
  const title = (topic?.title || "").toLowerCase();
  const desc = (topic?.description || "").toLowerCase();

  // Basic random generator helper
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const generateOptions = (ans: number | string, isString = false) => {
    if (isString) {
      return [
        ans as string,
        (ans as string).replace(/\d+/, (m) => (parseInt(m) + 1).toString()),
        (ans as string).replace(/\d+/, (m) => (parseInt(m) - 1).toString()),
        (ans as string).replace(/\d+/, (m) => (parseInt(m) + 2).toString())
      ].sort(() => Math.random() - 0.5);
    }
    const nAns = Number(ans);
    return [
      nAns.toString(),
      (nAns + rand(1, 5)).toString(),
      (nAns - rand(1, 5)).toString(),
      (nAns + rand(6, 10)).toString()
    ].sort(() => Math.random() - 0.5);
  };

  const generateOptionsFraction = (ansStr: string) => {
    const [num, den] = ansStr.split('/').map(Number);
    if (!den) return generateOptions(ansStr, true);
    return [
      ansStr,
      `${num + 1}/${den}`,
      `${Math.max(1, num - 1)}/${den}`,
      `${num}/${den + 1}`
    ].sort(() => Math.random() - 0.5);
  };

  const generateOptionsTime = (ansStr: string) => {
    return [
      ansStr,
      ansStr.replace(/\d+/, (m) => (parseInt(m) + 1).toString()),
      ansStr.replace(/\d+/, (m) => Math.max(0, parseInt(m) - 1).toString()),
      ansStr.replace(/\d+/, (m) => (parseInt(m) + 5).toString())
    ].sort(() => Math.random() - 0.5);
  };

  // Topic Checkers
  const isPecahan = title.includes("pecahan");
  const isPerpuluhan = title.includes("perpuluhan");
  const isWang = title.includes("wang");
  const isMasa = title.includes("masa") || title.includes("waktu");
  const isData = title.includes("data") || title.includes("purata") || title.includes("carta");
  const isPeratus = title.includes("peratus");
  const isRuang = title.includes("ruang") || title.includes("panjang") || title.includes("berat") || title.includes("jisim") || title.includes("isipadu") || title.includes("bentuk");
  const isKoordinat = title.includes("koordinat");
  const isNisbah = title.includes("nisbah") || title.includes("kadar");
  const isAlgebra = title.includes("algebra") || title.includes("perkaitan");
  const isKebarangkalian = title.includes("kebolehjadian") || title.includes("kebarangkalian");
  
  const isTambah = title.includes("tambah") || desc.includes("tambah");
  const isTolak = title.includes("tolak") || desc.includes("tolak");
  const isDarab = title.includes("darab") || desc.includes("mendarab");
  const isBahagi = title.includes("bahagi") || desc.includes("membahagi");
  const isGabung = title.includes("bergabung") || title.includes("campuran") || (!isTambah && !isTolak && !isDarab && !isBahagi);

  const getOp = (difficulty: string) => {
    const ops = [];
    if (isTambah) ops.push('+');
    if (isTolak) ops.push('-');
    if (isDarab) ops.push('*');
    if (isBahagi) ops.push('/');
    if (isGabung || ops.length === 0) {
      if (difficulty === "mudah") ops.push('+', '-');
      else if (difficulty === "sederhana") ops.push('+', '-', '*');
      else ops.push('+', '-', '*', '/');
    }
    return ops[rand(0, ops.length - 1)];
  };

  // Generator loop
  for (let i = 0; i < 30; i++) {
    
    let ans: string | number = "";
    
    let options: string[] | undefined;
    let imageUrl: string | undefined;
    const addQuestion = (q: Omit<Question, "id">) => {
      questions.push({ imageUrl, ...q, id: `q_${topicId}_${questions.length + 1}` });
    };
    const difficulty = i < 10 ? "mudah" : i < 20 ? "sederhana" : "kbat";
    let text = "";
    let explanation = "";
    
    let activeCategory = "";
    const possibleCats = [];
    if (isPecahan) possibleCats.push("pecahan");
    if (isPerpuluhan) possibleCats.push("perpuluhan");
    if (isWang) possibleCats.push("wang");
    if (isMasa) possibleCats.push("masa");
    if (isData) possibleCats.push("data");
    if (isPeratus) possibleCats.push("peratus");
    if (isRuang) possibleCats.push("ruang");
    if (isKoordinat) possibleCats.push("koordinat");
    if (isNisbah) possibleCats.push("nisbah");
    if (isAlgebra) possibleCats.push("algebra");
    if (isKebarangkalian) possibleCats.push("kebarangkalian");

    if (possibleCats.length > 0) {
      activeCategory = possibleCats[rand(0, possibleCats.length - 1)];
    }

    if (activeCategory === "pecahan") {
      // Fraction generator (uniform difficulty as requested)
      const ops = ['+', '-'];
      if (year >= 5) ops.push('*');
      const op = ops[rand(0, ops.length - 1)];
      const den = rand(2, 9);
      const a = rand(1, den - 1);
      const b = rand(1, den - 1);
      
      
      
      
      
      if (op === '+') {
        imageUrl = generateFractionSvg(a + b, den);
        ans = `${a + b}/${den}`;
        text = `Berapakah ${a}/${den} + ${b}/${den}?`;
        explanation = `Tambahkan pengangka: ${a} + ${b} = ${a + b}. Penyebut kekal ${den}.`;
      } else if (op === '-') {
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        imageUrl = generateFractionSvg(big - small, den);
        ans = `${big - small}/${den}`;
        text = `Berapakah ${big}/${den} - ${small}/${den}?`;
        explanation = `Tolakkan pengangka: ${big} - ${small} = ${big - small}. Penyebut kekal ${den}.`;
      } else if (op === '*') {
        const whole = rand(2, 5);
        imageUrl = generateFractionSvg(whole * a, den);
        ans = `${whole * a}/${den}`;
        text = `Berapakah ${whole} × ${a}/${den}?`;
        explanation = `Darabkan nombor bulat dengan pengangka: ${whole} × ${a} = ${whole * a}. Jawapan: ${ans}`;
      }
      
      const options = generateOptionsFraction(ans);
      addQuestion({ difficulty, text, options, correctAnswerIndex: options.indexOf(ans), explanation, imageUrl });
      
    } else if (activeCategory === "ruang") {
      const availableTypes = [];
      const tDesc = title + " " + desc;
      if (tDesc.includes("panjang")) availableTypes.push(1);
      if (tDesc.includes("jisim") || tDesc.includes("berat")) availableTypes.push(2);
      if (tDesc.includes("isipadu") || tDesc.includes("cecair")) availableTypes.push(3);
      if (tDesc.includes("ruang") || tDesc.includes("bentuk") || tDesc.includes("perimeter") || tDesc.includes("luas")) availableTypes.push(4);
      
      let type = rand(1, 4);
      if (availableTypes.length > 0) {
        type = availableTypes[rand(0, availableTypes.length - 1)];
      }

      
      
      
      

      if (type === 1) {
        // Panjang
        const a = rand(10, 50);
        const b = rand(5, 20);
        const unit = year > 3 ? "km" : year > 1 ? "m" : "cm";
        if (difficulty === "mudah") {
           ans = `${a + b} ${unit}`;
           text = `Panjang tali A ialah ${a} ${unit}. Panjang tali B ialah ${b} ${unit}. Berapakah jumlah panjang kedua-dua tali?`;
           explanation = `${a} + ${b} = ${a + b} ${unit}.`;
        } else if (difficulty === "sederhana") {
           const conv = year > 3 ? 1000 : 100;
           const unit2 = year > 3 ? "m" : "cm";
           ans = `${a * conv} ${unit2}`;
           text = `Tukarkan ${a} ${unit} kepada ${unit2}.`;
           explanation = `1 ${unit} = ${conv} ${unit2}. Jadi, ${a} x ${conv} = ${a * conv} ${unit2}.`;
        } else {
           ans = `${a * 5} ${unit}`;
           text = `Ahmad berlari sejauh ${a} ${unit} setiap hari. Berapakah jarak lariannya dalam masa 5 hari?`;
           explanation = `${a} x 5 = ${a * 5} ${unit}.`;
        }
        options = generateOptionsTime(ans);
      } else if (type === 2) {
        // Jisim
        const a = rand(2, 10);
        if (difficulty === "mudah") {
           ans = `${a + 2} kg`;
           text = `Jisim sebiji tembikai ialah ${a} kg. Jisim sebiji betik ialah 2 kg. Berapakah jumlah jisim?`;
           explanation = `${a} + 2 = ${a + 2} kg.`;
        } else if (difficulty === "sederhana") {
           ans = `${a * 1000} g`;
           text = `Tukarkan ${a} kg kepada unit gram (g).`;
           explanation = `1 kg = 1000 g. Jadi, ${a} x 1000 = ${a * 1000} g.`;
        } else {
           ans = `${a * 3} kg`;
           text = `Sebuah kotak berisi ${a} kg epal. Berapakah jisim bagi 3 buah kotak yang sama?`;
           explanation = `${a} x 3 = ${a * 3} kg.`;
        }
        options = generateOptionsTime(ans);
      } else if (type === 3) {
        // Isipadu
        const a = rand(2, 10);
        if (difficulty === "mudah") {
           ans = `${a + 3} l`;
           text = `Isipadu air di dalam baldi ialah ${a} l (liter). Ali menambah 3 l air lagi. Berapakah isipadu air sekarang?`;
           explanation = `${a} + 3 = ${a + 3} l.`;
        } else if (difficulty === "sederhana") {
           ans = `${a * 1000} ml`;
           text = `Tukarkan ${a} l (liter) kepada mililiter (ml).`;
           explanation = `1 l = 1000 ml. Jadi, ${a} x 1000 = ${a * 1000} ml.`;
        } else {
           ans = `${a * 4} l`;
           text = `Seorang penjual mengedarkan ${a} l jus setiap hari. Berapakah isipadu jus yang diedarkan dalam masa 4 hari?`;
           explanation = `${a} x 4 = ${a * 4} l.`;
        }
        options = generateOptionsTime(ans);
      } else {
        // Ruang / Bentuk
        const shapes2D = [
          {name: "Segi empat sama", sisi: 4, bucu: 4, image: svg2D["Segi empat sama"]},
          {name: "Segi empat tepat", sisi: 4, bucu: 4, image: svg2D["Segi empat tepat"]},
          {name: "Segi tiga", sisi: 3, bucu: 3, image: svg2D["Segi tiga"]}
        ];
        const shapes3D = [
          {name: "Kubus", permukaan: 6, bucu: 8, tepi: 12, image: svg3D["Kubus"]},
          {name: "Kuboid", permukaan: 6, bucu: 8, tepi: 12, image: svg3D["Kuboid"]},
          {name: "Piramid", permukaan: 5, bucu: 5, tepi: 8, image: svg3D["Piramid"]},
          {name: "Silinder", permukaan: 3, bucu: 0, tepi: 2, image: svg3D["Silinder"]}
        ];
        
        

        if (difficulty === "mudah") {
           const shape = shapes2D[rand(0, shapes2D.length - 1)];
           ans = shape.sisi.toString();
           text = `Berapakah bilangan sisi lurus bagi ${shape.name}?`;
           explanation = `${shape.name} mempunyai ${shape.sisi} sisi lurus.`;
           imageUrl = shape.image;
           options = generateOptions(ans);
        } else if (difficulty === "sederhana") {
           const shape = shapes3D[rand(0, shapes3D.length - 1)];
           ans = shape.permukaan.toString();
           text = `Berapakah bilangan permukaan bagi sebuah ${shape.name}?`;
           explanation = `${shape.name} mempunyai ${shape.permukaan} permukaan.`;
           imageUrl = shape.image;
           options = generateOptions(ans);
        } else {
           if (year >= 4) {
             const panjang = rand(4, 10);
             const lebar = rand(3, 8);
             ans = `${panjang * lebar} cm²`;
             text = `Sebuah segi empat tepat mempunyai panjang ${panjang} cm dan lebar ${lebar} cm. Kira luasnya.`;
             explanation = `Luas = Panjang × Lebar = ${panjang} × ${lebar} = ${panjang * lebar} cm².`;
             imageUrl = svg2D["Segi empat tepat"];
             options = generateOptionsTime(ans);
           } else {
             const shape = shapes3D[rand(0, 1)]; // kubus / kuboid
             ans = shape.name;
             text = `Apakah bentuk 3D yang mempunyai 6 permukaan rata, ${shape.bucu} bucu dan 12 tepi?`;
             options = shapes3D.map(s => s.name).sort(() => Math.random() - 0.5);
             explanation = `Ciri-ciri tersebut merujuk kepada bentuk ${shape.name}.`;
             imageUrl = shape.image;
           }
        }

        if (!options) options = generateOptions(ans);

        addQuestion({
          difficulty,
          text,
          options,
          correctAnswerIndex: options.indexOf(ans),
          explanation,
          imageUrl
        });
        
        continue;
      }

      if (!options) options = generateOptions(ans);

      addQuestion({
        difficulty,
        text,
        options,
        correctAnswerIndex: options.indexOf(ans),
        explanation, imageUrl
      });
      
    } else if (isPeratus) {
      // Percentage generator
      const type = rand(1, 3);
      
      
      

      if (type === 1) {
        // Percentage of a number
        const percent = rand(1, 9) * 10; 
        const num = rand(5, 20) * 10;
        ans = ((percent / 100) * num).toString();
        text = difficulty === "kbat" 
          ? `Terdapat ${num} orang murid di dalam dewan. ${percent}% daripadanya adalah murid lelaki. Berapakah bilangan murid lelaki?` 
          : `Berapakah ${percent}% daripada ${num}?`;
        explanation = `${percent}% × ${num} = (${percent}/100) × ${num} = ${ans}.`;
      } else if (type === 2) {
        // Convert fraction to percentage
        const num = rand(1, 4);
        const den = 5;
        ans = `${(num / den) * 100}%`;
        text = difficulty === "kbat"
          ? `Ali telah makan ${num}/${den} daripada sebiji piza. Nyatakan dalam bentuk peratusan.`
          : `Tukarkan pecahan ${num}/${den} kepada peratusan.`;
        explanation = `${num}/${den} × 100% = ${ans}.`;
      } else {
        // Convert decimal to percentage
        const dec = rand(1, 99) / 100;
        ans = `${Math.round(dec * 100)}%`;
        text = `Tukarkan nombor perpuluhan ${dec} kepada peratusan.`;
        explanation = `${dec} × 100% = ${ans}.`;
      }

      
      if (ans.includes('%')) {
        options = generateOptionsTime(ans);
      } else {
        options = generateOptions(ans);
      }
      
      addQuestion({
        difficulty,
        text,
        options,
        correctAnswerIndex: options.indexOf(ans),
        explanation, imageUrl
      });
      
    } else if (isData) {
      // Data management generator
      const dataSet = Array.from({length: 5}, () => rand(10, 50));
      const sum = dataSet.reduce((a, b) => a + b, 0);
      const mean = Math.round(sum / dataSet.length);
      const max = Math.max(...dataSet);
      const min = Math.min(...dataSet);
      
      let type = rand(1, 3);
      if (difficulty === "mudah") type = 3; // range
      
      if (year < 5) {
        // Perwakilan Data (Piktograf / Carta Palang) -> reading values
        const a = rand(2, 9);
        const b = rand(2, 9);
        
        
        
        if (difficulty === "mudah") {
           ans = a.toString();
           imageUrl = generatePiktografSvg(a, '⭐');
           text = `Dalam piktograf, satu '⭐' mewakili 1 orang murid. Jika Kumpulan A mempunyai ${a} bintang, berapakah jumlah murid Kumpulan A?`;
           explanation = `${a} bintang x 1 murid = ${a}.`;
        } else if (difficulty === "sederhana") {
           ans = (a * 5).toString();
           imageUrl = generatePiktografSvg(a, '⚽');
           text = `Satu simbol '⚽' mewakili 5 biji bola. Jika terdapat ${a} simbol, hitung jumlah bola kesemuanya.`;
           explanation = `Darabkan nilai.\n` + getBentukLazim(a, 5, '×', ans);
        } else {
           ans = (Math.abs(a - b) * 10).toString();
           imageUrl = generateBarChartSvg(a, b);
           text = `Carta palang: Merah (${Math.max(a, b)} blok), Biru (${Math.min(a, b)} blok). Setiap blok = 10 penyokong. Hitung beza penyokong Merah dan Biru.`;
           explanation = `Beza blok = ${Math.max(a,b)} - ${Math.min(a,b)} = ${Math.abs(a-b)} blok.\nDarabkan dengan 10.\n` + getBentukLazim(Math.abs(a-b), 10, '×', ans);
        }
        const options = generateOptions(ans);
        addQuestion({
          difficulty, text, options, correctAnswerIndex: options.indexOf(ans), explanation, imageUrl
        });
      } else {
        if (type === 1) {
          const ans = mean.toString();
          const options = generateOptions(ans);
          addQuestion({
            difficulty,
            text: `Data: ${dataSet.join(', ')}. Apakah nilai min (purata)?`,
            options, correctAnswerIndex: options.indexOf(ans),
            explanation: `Min = (Jumlah data) bahagi (bilangan data).\nJumlah = ${sum}.\n${sum} ÷ 5 = ${mean}`
          });
        } else if (type === 2) {
          const sorted = [...dataSet].sort((a,b)=>a-b);
          const median = sorted[2].toString();
          const options = generateOptions(median);
          addQuestion({
            difficulty,
            text: `Data: ${dataSet.join(', ')}. Apakah nilai median?`,
            options, correctAnswerIndex: options.indexOf(median),
            explanation: `Susun data secara menaik: ${sorted.join(', ')}.\nNilai di tengah adalah median = ${median}.`
          });
        } else {
          const range = (max - min).toString();
          const options = generateOptions(range);
          addQuestion({
            difficulty,
            text: `Data: ${dataSet.join(', ')}. Apakah nilai julat data tersebut?`,
            options, correctAnswerIndex: options.indexOf(range),
            explanation: `Julat = Nilai Maksimum (${max}) - Nilai Minimum (${min})\n` + getBentukLazim(max, min, '-', range)
          });
        }
      }
      
    } else if (isMasa) {
      // Time generator
      const op = getOp(difficulty);
      const h1 = rand(1, 10);
      const m1 = rand(10, 50);
      imageUrl = generateClockSvg(h1, m1);
      const s1 = rand(10, 50);
      const h2 = rand(1, 5);
      const m2 = rand(10, 50);
      const s2 = rand(10, 50);
      
      if (difficulty === "mudah") {
        if (op === '+') {
          const ans = `${h1 + h2} jam`;
          const options = generateOptionsTime(ans);
          addQuestion({ difficulty, text: `${h1} jam + ${h2} jam = ?`, options, correctAnswerIndex: options.indexOf(ans), explanation: `Tambahkan nilai masa.\n` + getBentukLazim(h1, h2, '+', h1 + h2)});
        } else {
          const ans = `${m1 + m2} minit`;
          const options = generateOptionsTime(ans);
          addQuestion({ difficulty, text: `${m1} minit + ${m2} minit = ?`, options, correctAnswerIndex: options.indexOf(ans), explanation: `Tambahkan nilai minit.\n` + getBentukLazim(m1, m2, '+', m1 + m2)});
        }
      } else if (difficulty === "sederhana") {
         if (op === '+') {
            let totalM = m1 + m2;
            let extraH = 0;
            if (totalM >= 60) { extraH = 1; totalM -= 60; }
            const totalH = h1 + h2 + extraH;
            const ans = `${totalH} jam ${totalM} minit`;
            const options = generateOptionsTime(ans);
            addQuestion({ difficulty, text: `${h1} jam ${m1} minit + ${h2} jam ${m2} minit = ?`, options, correctAnswerIndex: options.indexOf(ans), explanation: `Tambahkan minit: ${m1}+${m2}=${m1+m2}. Tukar 60 minit kepada 1 jam jika lebih. Tambah jam: ${h1}+${h2}+${extraH}=${totalH}. Jawapan: ${ans}`});
         } else {
            const mBig = Math.max(m1, m2);
            const mSmall = Math.min(m1, m2);
            const ans = `${mBig - mSmall} minit ${Math.abs(s1 - s2)} saat`;
            const options = generateOptionsTime(ans);
            addQuestion({ difficulty, text: `${mBig} minit ${Math.max(s1, s2)} saat - ${mSmall} minit ${Math.min(s1, s2)} saat = ?`, options, correctAnswerIndex: options.indexOf(ans), explanation: `Tolak bahagian minit dan saat secara berasingan.`, imageUrl});
         }
      } else {
         const ans = `${h1 * 2} jam ${m1 * 2 > 60 ? (m1*2)%60 : m1*2} minit`;
         const options = generateOptionsTime(ans);
         addQuestion({ difficulty, text: `Ahmad mengambil masa ${h1} jam ${m1} minit untuk menyiapkan satu projek. Berapakah masa untuk 2 projek yang sama?`, options, correctAnswerIndex: options.indexOf(ans), explanation: `Darabkan masa dengan 2. Jika minit melebihi 60, tukar kepada jam.`});
      }

    } else if (isPerpuluhan) {
      const op = getOp(difficulty);
      const a = (rand(10, 99) / 10);
      const b = (rand(10, 99) / 10);
      
      
      
      if (op === '+') {
         ans = (a + b).toFixed(1);
         explanation = `Susun titik perpuluhan sebaris.\n` + getBentukLazim(a.toFixed(1), b.toFixed(1), '+', ans);
      } else if (op === '-') {
         const big = Math.max(a, b).toFixed(1);
         const small = Math.min(a, b).toFixed(1);
         ans = Math.abs(a - b).toFixed(1);
         explanation = `Susun titik perpuluhan sebaris.\n` + getBentukLazim(big, small, '-', ans);
      } else if (op === '*') {
         const smallB = Math.floor(b);
         ans = (a * smallB).toFixed(1);
         explanation = `Darabkan nilai.\n` + getBentukLazim(a.toFixed(1), smallB, '×', ans);
      } else {
         ans = (a + b).toFixed(1);
         explanation = `Susun titik perpuluhan sebaris.\n` + getBentukLazim(a.toFixed(1), b.toFixed(1), '+', ans);
      }
      
      const options = generateOptions(ans, true);
      addQuestion({
        difficulty,
        text: op === '*' ? `${a} × ${Math.floor(b)} = ?` : `${Math.max(a,b)} ${op} ${Math.min(a,b)} = ?`,
        options, correctAnswerIndex: options.indexOf(ans),
        explanation, imageUrl
      });

    } else if (isWang) {
       const op = getOp(difficulty);
       const a = rand(10, 100) * year;
       const b = rand(5, 50) * year;
       
       
       
       
       if (op === '+') {
         ans = `RM${a + b}`; text = `RM${a} + RM${b} = ?`;
         explanation = `Tambahkan nilai wang.\n` + getBentukLazim(a, b, '+', a + b);
       } else if (op === '-') {
         ans = `RM${Math.abs(a - b)}`; text = `RM${Math.max(a,b)} - RM${Math.min(a,b)} = ?`;
         explanation = `Tolak nilai wang.\n` + getBentukLazim(Math.max(a,b), Math.min(a,b), '-', Math.abs(a-b));
       } else if (op === '*') {
         const smallB = rand(2,5);
         ans = `RM${a * smallB}`; text = `RM${a} × ${smallB} = ?`;
         explanation = `Darabkan nilai wang.\n` + getBentukLazim(a, smallB, '×', a * smallB);
       } else {
         ans = `RM${a + b}`; text = `Siti beli baju RM${a} dan kasut RM${b}. Jumlah harga?`;
         explanation = `Tambahkan nilai wang.\n` + getBentukLazim(a, b, '+', a + b);
       }
       
       const options = generateOptions(ans, true);
       addQuestion({
         difficulty, text, options, correctAnswerIndex: options.indexOf(ans),
         explanation, imageUrl
       });

    } else if (isKoordinat) {
       const x = rand(1, 8);
       const y = rand(1, 8);
       const ans = `(${x}, ${y})`;
       const options = [
         `(${x}, ${y})`, `(${y}, ${x})`, `(${x+1}, ${y})`, `(${x}, ${y+1})`
       ].sort(() => Math.random() - 0.5);
       addQuestion({
         difficulty,
         text: `Nyatakan koordinat bagi titik yang terletak pada paksi-x = ${x} dan paksi-y = ${y}.`,
         options, correctAnswerIndex: options.indexOf(ans),
         explanation: `Koordinat ditulis sebagai (x, y). Jawapan: ${ans}.`
       });
    } else if (isNisbah) {
       const a = rand(2, 5);
       const b = rand(6, 10);
       const ans = `${a}:${b}`;
       const options = [
         `${a}:${b}`, `${b}:${a}`, `${a+1}:${b}`, `${a}:${b-1}`
       ].sort(() => Math.random() - 0.5);
       addQuestion({
         difficulty,
         text: difficulty === "kbat" 
          ? `Di dalam kelas, terdapat ${a} orang murid lelaki dan ${b} orang murid perempuan. Apakah nisbah murid lelaki kepada murid perempuan?`
          : `Nyatakan nisbah ${a} kepada ${b}.`,
         options, correctAnswerIndex: options.indexOf(ans),
         explanation: `Nisbah A kepada B ditulis sebagai A:B. Jawapan: ${ans}.`
       });
    } else if (isAlgebra) {
       const a = rand(2, 10);
       const b = rand(11, 30);
       const ans = (b - a).toString();
       const options = generateOptions(ans);
       addQuestion({
         difficulty,
         text: `Cari nilai p: p + ${a} = ${b}`,
         options, correctAnswerIndex: options.indexOf(ans),
         explanation: `p = ${b} - ${a} = ${ans}.`
       });
    } else if (isKebarangkalian) {
       const events = ["Matahari terbit dari timur", "Seorang manusia boleh terbang secara natural", "Mendapat nombor genap dari balingan dadu 6 permukaan", "Hujan akan turun secara tiba-tiba"];
       const idx = rand(0, 3);
       const ans = idx === 0 ? "Pasti" : idx === 1 ? "Mustahil" : idx === 2 ? "Sama kemungkinan" : "Mungkin";
       const options = ["Pasti", "Mustahil", "Sama kemungkinan", "Mungkin"].sort(() => Math.random() - 0.5);
       addQuestion({
         difficulty,
         text: `Apakah kebolehjadian bagi peristiwa ini: "${events[idx]}"?`,
         options, correctAnswerIndex: options.indexOf(ans),
         explanation: `Kejadian "${events[idx]}" adalah ${ans.toLowerCase()}.`
       });
    } else {
      // Default: Nombor bulat (Basic arithmetic based on year and difficulty)
      const op = getOp(difficulty);
      const mul = year * (difficulty === "kbat" ? 10 : difficulty === "sederhana" ? 5 : 1);
      const a = rand(10, 50) * mul;
      const b = rand(2, 20) * mul;
      
      
      
      
      
      if (op === '+') {
        ans = (a + b).toString();
        text = difficulty === "kbat" 
          ? `Syarikat A hasilkan ${a} produk, Syarikat B hasilkan ${b} produk. Berapakah jumlah produk kesemuanya?`
          : `${a} + ${b} = ?`;
        explanation = `Tambahkan nilai.\n` + getBentukLazim(a, b, '+', a + b);
      } else if (op === '-') {
        ans = Math.abs(a - b).toString();
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        text = difficulty === "kbat"
          ? `Terdapat ${big} penonton. ${small} penonton telah pulang. Berapa yang tinggal?`
          : `${big} - ${small} = ?`;
        explanation = `Tolakkan nilai.\n` + getBentukLazim(big, small, '-', ans);
      } else if (op === '*') {
        const smallB = rand(2, 9);
        ans = (a * smallB).toString();
        text = difficulty === "kbat"
          ? `Sebuah dewan ada ${a} baris kerusi. Setiap baris ada ${smallB} kerusi. Jumlah kerusi?`
          : `${a} × ${smallB} = ?`;
        explanation = `Darabkan nilai.\n` + getBentukLazim(a, smallB, '×', ans);
      } else {
        const smallB = rand(2, 9);
        const dividend = a * smallB;
        ans = a.toString();
        text = difficulty === "kbat"
          ? `Ada ${dividend} biji gula-gula dikongsi sama rata kepada ${smallB} orang kanak-kanak. Berapa setiap seorang dapat?`
          : `${dividend} ÷ ${smallB} = ?`;
        explanation = `Bahagikan nilai.\n` + getBahagiLazim(dividend, smallB, a);
      }

      const options = generateOptions(ans);
      addQuestion({
        difficulty, text, options, correctAnswerIndex: options.indexOf(ans),
        explanation, imageUrl
      });
    }
  }

  return questions;
}

