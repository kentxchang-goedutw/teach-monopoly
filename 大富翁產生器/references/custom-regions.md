# custom-regions（可改 vs 禁止改）

打包腳本只允許替換以下區塊，其餘一律不動：

可改（5 處）：

1. `<title>…</title>` → gameTitle＋版本尾綴。
2. `#setup-screen h1.setup-title` 文字 → setupTitle。
3. `const initialBoardSpacesData = […]` → 按 board-spec 重建成 40 格（特殊格原樣、property 換名換價換 rent、station/utility 換名）。
4. `const chanceCards = […]`、`const destinyCards = […]` → 整段替換。
5. `gameState = { quizzes: {}, activeQuizBanks: [], availableQuizIndices: {}, gameTitle: '…' }` → 注入題庫、activeQuizBanks、availableQuizIndices（自動由題庫長度生成）、gameTitle。

禁止改（紅線）：棋盤 grid CSS、`.space` 普普風樣式、遊戲流程函式（rollDice/movePlayer/handleSpaceAction/payRent/goToJail/checkBankruptcy/endGame）、問答觸發邏輯、3D 骰子、音效/BGM、計時器、地圖拖曳把手、玩家歷程、匯出/匯入、AI 設計區、XLSX 匯入、頁尾作者與授權、所有 Modal 結構。
