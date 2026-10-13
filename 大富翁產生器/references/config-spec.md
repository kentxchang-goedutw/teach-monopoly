# config-spec（.tmp-monopoly-config.json）

```json
{
  "gameTitle": "台灣美食大富翁",
  "setupTitle": "🎲 台灣美食大富翁：夜市致富之旅",
  "board": [
    {"index": 1, "newName": "士林大香腸", "newPrice": 600},
    {"index": 3, "newName": "…", "newPrice": 600}
  ],
  "chanceCards": [{"text": "…", "action": "money", "amount": 2000}],
  "destinyCards": [{"text": "…", "action": "money", "amount": -500}],
  "quizBanks": {
    "台灣歷史": [
      {"question": "…？", "options": ["A","B","C","D"], "answer": 1}
    ]
  },
  "activeQuizBanks": ["台灣歷史"],
  "defaults": {"initialMoney": 15000, "gameTime": 0}
}
```

- `board`：恰 28 筆，index 須為 board-spec 允許的 28 個可改序號且不重複；station/utility 的 newPrice 會被打包腳本強制覆寫為 2000/1500。
- `activeQuizBanks`：須為 `quizBanks` 的 key 子集；可為空陣列（無題庫模式）。
- `defaults`：可省略。省略時沿用範本預設（$15,000、不計時），玩家在產出 HTML 的設定畫面選單自行調整；若有寫，`initialMoney` 為正整數、`gameTime` 為 0（不計時）或分鐘數。
