# cards-spec（機會／命運卡）

兩疊各自 6–8 張。`action` 只允許以下 5 種：

| action | 參數 | 範例 |
|--------|------|------|
| money | amount（正＝獲得，負＝支出） | `{text:"中統一發票，獲得 $2000。", action:"money", amount:2000}` |
| move | position（0–39 格序，見 board-spec） | `{text:"前進到起點。", action:"move", position:0}` |
| moveRelative | amount（步數，正整數） | `{text:"前進三步。", action:"moveRelative", amount:3}` |
| goToJail | 無參數 | `{text:"直接進入監獄。", action:"goToJail"}` |
| getOutOfJail | 無參數 | `{text:"免費出獄卡。", action:"getOutOfJail"}` |

規則：

- `text` 要扣主題（例如美食主題：夜市消費券、健保費改成月亮蝦餅脹氣掛急診等），不可空白。
- chance 以正面事件為主，destiny 正負混合。
- `move.position` 必須是 0–39 整數；`moveRelative.amount` 為 1–39 整數；`money.amount` 不可為 0（建議 ±200–2000）。
- 兩疊至少各保留 1 張 money 卡，避免整疊都是移動卡導致遊戲失衡。
