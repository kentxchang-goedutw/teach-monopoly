# board-spec（40 格固定位置表）

位置索引 0–39 不可增刪、不可調序。只能改下表「可改」欄位。

| 序 | 類型 | 預設名 | 可改 |
|----|------|--------|------|
| 0 | go | 起點 | 不可改 |
| 1 | property | 墾丁大街 | 名＋價（group #d9b699 保留） |
| 2 | destiny | 命運 | 不可改 |
| 3 | property | 鵝鑾鼻公園 | 名＋價（group #d9b699） |
| 4 | tax | 所得稅 $2000 | 不可改 |
| 5 | station | 高鐵左營站 | 名可改，價固定 2000、rent 固定 250 |
| 6 | property | 安平古堡 | 名＋價（group #bfe3ff） |
| 7 | chance | 機會 | 不可改 |
| 8 | property | 赤崁樓 | 名＋價（group #bfe3ff） |
| 9 | property | 七股鹽山 | 名＋價（group #bfe3ff） |
| 10 | jail | 監獄 | 不可改 |
| 11 | property | 日月潭 | 名＋價（group #ffc9de） |
| 12 | utility | 台積電 | 名可改，價固定 1500 |
| 13 | property | 清境農場 | 名＋價（group #ffc9de） |
| 14 | property | 逢甲夜市 | 名＋價（group #ffc9de） |
| 15 | station | 高鐵台中站 | 名可改，價 2000／rent 250 固定 |
| 16 | property | 大溪老街 | 名＋價（group #ffcf9e） |
| 17 | destiny | 命運 | 不可改 |
| 18 | property | 石門水庫 | 名＋價（group #ffcf9e） |
| 19 | property | 小人國 | 名＋價（group #ffcf9e） |
| 20 | parking | 免費停車 | 不可改 |
| 21 | property | 故宮博物院 | 名＋價（group #ff9eb0） |
| 22 | chance | 機會 | 不可改 |
| 23 | property | 中正紀念堂 | 名＋價（group #ff9eb0） |
| 24 | property | 士林夜市 | 名＋價（group #ff9eb0） |
| 25 | station | 高鐵台北站 | 名可改，價／rent 固定 |
| 26 | property | 淡水老街 | 名＋價（group #fff0a3） |
| 27 | property | 九份 | 名＋價（group #fff0a3） |
| 28 | utility | 長榮海運 | 名可改，價固定 1500 |
| 29 | property | 野柳女王頭 | 名＋價（group #fff0a3） |
| 30 | goToJail | 前往監獄 | 不可改 |
| 31 | property | 太魯閣 | 名＋價（group #a8e6c1） |
| 32 | property | 清水斷崖 | 名＋價（group #a8e6c1） |
| 33 | destiny | 命運 | 不可改 |
| 34 | property | 七星潭 | 名＋價（group #a8e6c1） |
| 35 | station | 高鐵花蓮站 | 名可改，價／rent 固定 |
| 36 | chance | 機會 | 不可改 |
| 37 | property | 陽明山 | 名＋價（group #9db8e8） |
| 38 | tax | 奢侈稅 $1000 | 不可改 |
| 39 | property | 台北101 | 名＋價（group #9db8e8） |

規則：

- property：`newPrice` 600–4000 且為 100 的倍數；`rent = max(20, round(price*0.05))` 由打包腳本自動算，不用手填。
- station：只改名，不改價/rent。
- utility：只改名，不改價。
- group 色碼原樣保留（同組地名風格要一致，例如同組都是夜市/都是行星）。
- 地名不可空白、28 格內不可重複（大小寫/空白差異視為重複）。
