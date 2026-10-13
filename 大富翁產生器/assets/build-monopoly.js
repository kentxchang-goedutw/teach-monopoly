// build-monopoly.js — config + template → 可玩 HTML（只改可自訂 5 處）
// 用法: node build-monopoly.js <config.json> <輸出.html> [template.html]
const fs = require('fs');
const path = require('path');

const [,, cfgPath, outPath, tplArg] = process.argv;
if (!cfgPath || !outPath) { console.error('用法: node build-monopoly.js <config.json> <輸出.html> [template.html]'); process.exit(1); }
const tplPath = tplArg || path.join(__dirname, 'template.html');
const cfg = JSON.parse(fs.readFileSync(cfgPath,'utf8'));
let html = fs.readFileSync(tplPath,'utf8');

const need = ['const initialBoardSpacesData =','const chanceCards =','const destinyCards =','quizzes:','gameTitle:'];
for (const m of need) if (!html.includes(m)) { console.error('ERROR: 模板缺少標記: ' + m); process.exit(1); }
if (!html.includes('阿剛老師') || !html.includes('kentxchang.blogspot.tw')) {
  console.error('ERROR: 模板缺少作者標記，拒絕打包'); process.exit(1);
}

// 1. board：解析模板基底 40 格，套用 28 格覆寫
const baseStr = html.match(/const initialBoardSpacesData = (\[[\s\S]*?\]);/)[1];
const base = new Function('return ' + baseStr)();
const override = new Map(cfg.board.map(b=>[b.index, b]));
const STATION_PRICE = 2000, STATION_RENT = 250, UTILITY_PRICE = 1500;
const built = base.map((s, idx)=>{
  if (!override.has(idx)) return s;
  const o = override.get(idx);
  const n = { ...s, name: String(o.newName).trim() };
  if (s.type === 'property') {
    const p = Math.round(Number(o.newPrice)/100)*100;
    n.price = p;
    n.rent = Math.max(20, Math.round(p*0.05));
  } else if (s.type === 'station') { n.price = STATION_PRICE; n.rent = STATION_RENT; }
  else if (s.type === 'utility') { n.price = UTILITY_PRICE; }
  return n;
});
html = html.replace(/const initialBoardSpacesData = \[[\s\S]*?\];/,
  () => 'const initialBoardSpacesData = ' + JSON.stringify(built) + ';');

// 2. cards
html = html.replace(/const chanceCards = \[[\s\S]*?\];/,
  () => 'const chanceCards = ' + JSON.stringify(cfg.chanceCards) + ';');
html = html.replace(/const destinyCards = \[[\s\S]*?\];/,
  () => 'const destinyCards = ' + JSON.stringify(cfg.destinyCards) + ';');

// 3. gameState：注入題庫＋啟用＋索引＋標題
const banks = cfg.quizBanks || {};
const avail = {};
for (const k of Object.keys(banks)) avail[k] = banks[k].map((_,i)=>i);
html = html.replace(/quizzes: \{\},/, () => 'quizzes: ' + JSON.stringify(banks) + ',');
html = html.replace(/activeQuizBanks: \[\],/, () => 'activeQuizBanks: ' + JSON.stringify(cfg.activeQuizBanks || Object.keys(banks)) + ',');
html = html.replace(/availableQuizIndices: \{\},/, () => 'availableQuizIndices: ' + JSON.stringify(avail) + ',');
html = html.replace(/gameTitle: '台灣大富翁'/, () => 'gameTitle: ' + JSON.stringify(cfg.gameTitle));

// 4. <title> 與設定畫面標題
html = html.replace(/<title>.*?<\/title>/, () => '<title>' + escapeHtml(cfg.gameTitle) + '</title>');
html = html.replace(/(<h1 class="setup-title">).*?(<\/h1>)/, (m, p1, p2) => p1 + escapeHtml(cfg.setupTitle || cfg.gameTitle) + p2);

// 5. 預設資金／時間（只改 selected，不改邏輯）
if (cfg.defaults) {
  html = setSelectDefault(html, 'initial-money-select', String(cfg.defaults.initialMoney), ['15000','10000','5000','custom']);
  if (!['15000','10000','5000'].includes(String(cfg.defaults.initialMoney)))
    html = html.replace(/(id="initial-money-custom"[^>]*value=")[^"]*(")/, (m, p1, p2) => p1 + Number(cfg.defaults.initialMoney) + p2);
  html = setSelectDefault(html, 'game-time-select', String(cfg.defaults.gameTime), ['0','10','20','custom']);
  if (!['0','10','20'].includes(String(cfg.defaults.gameTime)))
    html = html.replace(/(id="game-time-custom"[^>]*value=")[^"]*(")/, (m, p1, p2) => p1 + Number(cfg.defaults.gameTime) + p2);
}

fs.writeFileSync(outPath, html, 'utf8');
console.log('BUILD OK: ' + outPath);

function setSelectDefault(html, selectId, value, allowed){
  const target = allowed.includes(value) ? value : 'custom';
  const re = new RegExp('(<select id="' + selectId + '"[\\s\\S]*?</select>)');
  const m = html.match(re);
  if (!m) return html;
  let block = m[1].replace(/\sselected(?=[\s>])/g,'');
  block = block.replace(new RegExp('<option value="' + target + '"'), () => '<option value="' + target + '" selected');
  // 注意：必須用函式替換。block 內含「$15,000」字樣，若用字串替換會被誤判為 $1 分組參照而灌爆選單。
  return html.replace(re, () => block);
}
function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
