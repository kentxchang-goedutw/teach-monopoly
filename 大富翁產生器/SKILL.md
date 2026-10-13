---
name: 大富翁產生器
description: 以範本生成可直接雙擊遊玩的大富翁HTML。一問一答收集地圖主題→生成地名與機會命運卡→收集多組教材(PDF/文字)生成多組題庫→打包成單檔HTML。當使用者提到大富翁、monopoly、地圖主題、機會命運卡、題庫大富翁、教材出題遊戲時使用。
license: CC-BY-NC-SA-4.0
metadata:
  author: 阿剛老師
  url: https://kentxchang.blogspot.tw
  template: assets/template.html
---

# 大富翁產生器

把一個地圖主題＋N 組教材，變成**可直接雙擊遊玩**的大富翁單檔 HTML。
功能架構完全沿用 `assets/template.html`（V5 新版介面：3D 骰子、音效/BGM、計時、匯出/載入進度、玩家歷程、AI 設計區、XLSX 題庫匯入），只替換可自訂內容。

## 核心原則（一問一答）

- **每次只問一件事**，等使用者回答後再問下一題。不要一次拋出多個問題。
- 每個生成步驟後**先列出結果表格請使用者確認**（可改名、增刪、調整題數），確認後才往下走。
- **不要修改範本功能架構**：只允許改 `references/custom-regions.md` 列出的可自訂區；組裝一律經 `assets/build-monopoly.js`，不可手繪改模板其他行。
- **不要捏造教材沒有的內容**出題；題庫不足時先告知並建議合併，不要硬灌重複題。

## 交付成果

單一 HTML（單檔、離線可玩、雙擊即開，CDN 僅 tailwind/three/xlsx 與範本相同）：

- 開啟即進設定畫面 → 選人數/初始資金/時間 → 勾選題庫 → 開始遊戲。
- 地圖、機會/命運卡、題庫皆已按使用者確認內容內建；玩家仍可在設定畫面手動修改地圖/卡片或另外匯入 XLSX。
- 頁尾保留 `Made by 阿剛老師`（連到 `https://kentxchang.blogspot.tw`，`target="_blank"`）與 CC BY-NC-SA 4.0 授權。

## 執行流程

### 階段 0｜確認範本

1. 確認 `assets/template.html` 存在。若缺失，停下來問使用者要提供範本路徑，不要自創遊戲邏輯。

### 階段 1｜Q1：地圖主題（第 1 問）

1. 問：「想要什麼地圖主題？（例如：台灣美食、任天堂遊戲、太空探索、歷史人物）」
2. 收到主題後，讀 `references/board-spec.md` 與 `references/cards-spec.md`，生成：
   - `gameTitle`（例如「台灣美食大富翁」）、`setupTitle`（例如「🎲 台灣美食大富翁：夜市致富之旅」）
   - 28 格可改地名＋價格（位置、group 顏色、租金規則見 board-spec，不動 12 格特殊格）
   - 機會 6–8 張、命運 6–8 張（action 僅限 spec 允許的 5 種）
3. **用表格列出並停下來等確認**：

   | 格序 | 原格名 | 新格名 | 價格 | 租金(自動算) |
   |------|--------|--------|------|--------------|
   | 1 | 墾丁大街 | … | … | … |

   另列機會/命運卡表格（卡片文字｜動作｜參數）。明說可改名、改價、增刪卡片。
4. 使用者確認後定案為 canonical 地圖＋卡片，存入工作區 `.tmp-monopoly-config.json`（格式見 `references/config-spec.md`）。

### 階段 2｜Q2：第 N 組教材（逐組一問一答，可多組）

1. 問：「請提供第 1 組教材（上傳 PDF/DOCX/PPTX/MD/TXT 或直接貼文字/網址），以及：題庫名稱＋要幾題？（例如：題庫名『台灣歷史』、10 題）」
2. 取得來源後：
   - 檔案 → 用 Read 讀取（PDF 用 Read 即可取文字）；網址 → 用 WebFetch；貼文 → 直接分析。
   - 掃描版讀不到文字時，**先問**要文字版還是改用描述，不要硬出題。
3. 讀 `references/quiz-spec.md` 生成該組題庫：每題四選一、`answer` 為 0–3 整數、選項不重複、題幹不重複。
4. **列出統計＋抽查 3–5 題全文請確認**（題數、題庫名可改；發現超出教材範圍的題目要刪）。
5. 確認後追加進 `.tmp-monopoly-config.json` 的 `quizBanks`。

### 階段 3｜Q3：還有下一組嗎？（每組結束必問）

1. 問：「還有下一組教材要做成另一個題庫嗎？（有／沒有）」
2. 有 → 回到階段 2 的 Q2（第 2、3…組）；沒有 → 進入組裝。
3. 至少要有 1 組題庫才能打包；若使用者說都沒有教材、只想先玩地圖，告知「無題庫時遊戲中不會觸發問答」，確認後可放行（`quizBanks` 留空）。

> 初始資金與遊戲時間不需提問：沿用範本預設（$15,000、不計時），玩家在產出 HTML 的設定畫面選單自行調整即可。

### 階段 4｜組裝與驗證

1. 跑驗證：

   ```bash
   node <本skill目錄>/assets/validate-monopoly.js <config.json>
   ```

   有 `ERROR` 就修到歸零。
2. 跑打包（不要手改模板）：

   ```bash
   node <本skill目錄>/assets/build-monopoly.js <config.json> <輸出.html>
   ```

   輸出檔名用 `〈gameTitle〉-大富翁.html`。
3. 用 Node 檢查輸出 HTML 的 `<script>` 無語法錯誤（見下方檢查指令），並確認頁尾作者連結與授權文字仍在。

### 階段 5｜交付

交付訊息包含：

- 輸出 HTML 完整路徑（可直接雙擊遊玩）。
- 地圖主題、28 格新地名總覽（表格或收合清單）、機會/命運各幾張。
- 題庫清單：各題庫名 × 題數 × 共幾題；抽查題範例 2–3 題。
- 玩法說明：開檔 → 選人數 → 在設定畫面選單調整初始資金/遊戲時間 → 勾題庫 → 開始 → 擲骰子；答對才可買地/抽卡，答錯跳過該格動作；時間到或剩一人即結算。
- 詢問是否要調整地名、卡片或追加題庫（要改就更新 config 重跑打包）。

## 檢查指令

```bash
# config 驗證（必跑）
node <本skill目錄>/assets/validate-monopoly.js <config.json>
# 打包（必經此腳本）
node <本skill目錄>/assets/build-monopoly.js <config.json> <輸出.html>
# 輸出 HTML 語法檢查（把 <輸出.html> 換成實際路徑）
node -e "const fs=require('fs');const h=fs.readFileSync(process.argv[1],'utf8');for(const m of h.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)){new Function(m[1]);}console.log('SYNTAX OK');" <輸出.html>
```

## 紅線

- **不要一次問多件事。** 一問一答是硬性要求。
- **不要未經確認就打包。** 地圖/卡片/每組題庫都要先列出請使用者確認。
- **不要改模板功能架構。** 棋盤 grid CSS、遊戲流程函式、音效/3D 骰子、localStorage、AI 設計區邏輯一律不動；只改 `references/custom-regions.md` 允許的區塊，且一律經打包腳本。
- **不要捏造教材內容出題。** 教材沒講的不出；題數撐不起來就告知並建議合併或減少題數。
- **不要跳過 `validate-monopoly.js`。** 手寫 JSON 必有錯字與重複題幹。
- **不要刪除頁尾作者與授權。** `Made by 阿剛老師`＋CC BY-NC-SA 4.0 必須保留。
- **不要把題庫放外部 JSON。** 必須內嵌進單一 HTML（瀏覽器同源政策會擋外部檔）。

## 資源檔案

| 路徑 | 用途 |
|------|------|
| `assets/template.html` | 範本 HTML（V5 新版介面），打包腳本的唯一模板來源 |
| `assets/build-monopoly.js` | 打包腳本：config＋模板→可玩 HTML，必經此腳本 |
| `assets/validate-monopoly.js` | config 驗證器，打包前必跑 |
| `references/board-spec.md` | 40 格固定位置表、可改/不可改欄位、價格租金規則 |
| `references/cards-spec.md` | 機會/命運卡 action 種類與參數規則 |
| `references/quiz-spec.md` | 題庫欄位規格與命題紅線 |
| `references/config-spec.md` | `.tmp-monopoly-config.json` 欄位規格 |
| `references/custom-regions.md` | 模板中可改區塊 vs 禁止修改區對照表 |
