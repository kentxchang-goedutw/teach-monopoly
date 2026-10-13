// validate-monopoly.js — 驗證 .tmp-monopoly-config.json
// 用法: node validate-monopoly.js <config.json>
const fs = require('fs');

const CUSTOMIZABLE = new Set([1,3,5,6,8,9,11,12,13,14,15,16,18,19,21,23,24,25,26,27,28,29,31,32,34,35,37,39]);
const STATIONS = new Set([5,15,25,35]);
const UTILITIES = new Set([12,28]);
const VALID_ACTIONS = new Set(['money','move','moveRelative','goToJail','getOutOfJail']);

function fail(msg){ console.log('ERROR: ' + msg); errors++; }
function warn(msg){ console.log('WARN: ' + msg); }
let errors = 0;

const file = process.argv[2];
if (!file) { console.log('ERROR: 請提供 config 路徑'); process.exit(1); }
let cfg;
try { cfg = JSON.parse(fs.readFileSync(file,'utf8')); }
catch(e){ console.log('ERROR: JSON 解析失敗: ' + e.message); process.exit(1); }

if (!cfg.gameTitle || !String(cfg.gameTitle).trim()) fail('gameTitle 不可空');
if (!cfg.setupTitle || !String(cfg.setupTitle).trim()) fail('setupTitle 不可空');

// board
if (!Array.isArray(cfg.board) || cfg.board.length !== 28) {
  fail(`board 須恰 28 筆，實際 ${Array.isArray(cfg.board)?cfg.board.length:'非陣列'}`);
} else {
  const seen = new Set(); const names = new Set();
  for (const b of cfg.board) {
    if (!CUSTOMIZABLE.has(b.index)) { fail(`board.index ${b.index} 不可自訂`); continue; }
    if (seen.has(b.index)) fail(`board.index ${b.index} 重複`);
    seen.add(b.index);
    const nm = String(b.newName||'').trim();
    if (!nm) fail(`index ${b.index} 新地名不可空`);
    const key = nm.replace(/[\s　]/g,'').toLowerCase();
    if (names.has(key)) fail(`地名重複: ${nm}`);
    names.add(key);
    if (STATIONS.has(b.index) || UTILITIES.has(b.index)) continue; // 價格由打包腳本固定
    const p = Number(b.newPrice);
    if (!Number.isInteger(p) || p < 600 || p > 4000 || p % 100 !== 0)
      fail(`index ${b.index} 價格須為 600–4000 且為 100 倍數，實際 ${b.newPrice}`);
  }
  for (const idx of CUSTOMIZABLE) if (!seen.has(idx)) fail(`缺少可改格 index ${idx}`);
}

// cards
function checkCards(list, label){
  if (!Array.isArray(list) || list.length < 6 || list.length > 8) { fail(`${label} 須 6–8 張，實際 ${Array.isArray(list)?list.length:'非陣列'}`); return; }
  let hasMoney = false;
  list.forEach((c,i)=>{
    if (!c.text || !String(c.text).trim()) fail(`${label}[${i}] 文字不可空`);
    if (!VALID_ACTIONS.has(c.action)) { fail(`${label}[${i}] action 非法: ${c.action}`); return; }
    if (c.action === 'money') { hasMoney = true; if (!Number.isInteger(c.amount) || c.amount === 0) fail(`${label}[${i}] money.amount 須為非零整數`); }
    if (c.action === 'move') { if (!Number.isInteger(c.position) || c.position < 0 || c.position > 39) fail(`${label}[${i}] move.position 須 0–39`); }
    if (c.action === 'moveRelative') { if (!Number.isInteger(c.amount) || c.amount < 1 || c.amount > 39) fail(`${label}[${i}] moveRelative.amount 須 1–39`); }
  });
  if (!hasMoney) fail(`${label} 至少需 1 張 money 卡`);
}
checkCards(cfg.chanceCards, 'chanceCards');
checkCards(cfg.destinyCards, 'destinyCards');

// quizzes
if (cfg.quizBanks === undefined || typeof cfg.quizBanks !== 'object') {
  fail('quizBanks 須為物件');
} else {
  const banks = Object.keys(cfg.quizBanks);
  if (banks.length === 0) warn('quizBanks 為空：遊戲中將不會觸發問答');
  for (const name of banks) {
    const qs = cfg.quizBanks[name];
    if (!Array.isArray(qs) || qs.length === 0) { fail(`題庫「${name}」無題目`); continue; }
    const seenQ = new Set();
    qs.forEach((q,i)=>{
      const tag = `題庫「${name}」[${i}]`;
      if (!q.question || !String(q.question).trim()) { fail(tag+' 題幹不可空'); return; }
      const qk = String(q.question).replace(/[\s　，、。？！?!.,;:：；「」"']/g,'');
      if (seenQ.has(qk)) fail(tag+' 題幹重複');
      seenQ.add(qk);
      if (!Array.isArray(q.options) || q.options.length !== 4) { fail(tag+' 須恰 4 個選項'); return; }
      const opts = q.options.map(o=>String(o||'').trim());
      if (opts.some(o=>!o)) fail(tag+' 選項不可空');
      if (new Set(opts).size !== 4) fail(tag+' 選項重複');
      if (opts.some(o=>/以上皆是|以上皆非/.test(o))) fail(tag+' 不可用以上皆是/皆非');
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) fail(tag+' answer 須 0–3 整數');
    });
  }
  const active = cfg.activeQuizBanks || [];
  for (const a of active) if (!cfg.quizBanks[a]) fail(`activeQuizBanks「${a}」不存在於 quizBanks`);
}

// defaults
if (cfg.defaults) {
  const m = Number(cfg.defaults.initialMoney);
  if (!Number.isInteger(m) || m <= 0) fail('defaults.initialMoney 須正整數');
  const t = Number(cfg.defaults.gameTime);
  if (!Number.isInteger(t) || t < 0) fail('defaults.gameTime 須 >=0 整數（0=不計時）');
}

console.log(errors === 0 ? 'VALIDATE OK' : `VALIDATE FAILED: ${errors} 個 ERROR`);
process.exit(errors === 0 ? 0 : 1);
