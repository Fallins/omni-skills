---
name: gs-tdd
description: >-
  Test-driven development with red-green loop and seam agreement. Manual invoke
  only (/gs-tdd); also Read by gs-implement.
disable-model-invocation: true
---

# gs-tdd

## 語言

與使用者對話一律使用**繁體中文**。

探索 codebase 時依 `AW/domain.md` 讀取已有的 `AW/CONTEXT.md`，測試命名與介面詞彙對齊領域語言，並尊重相關 ADR。

## 好測試是什麼

透過**公開介面**驗證行為，不綁實作細節。好測試讀起來像規格。細節與範例見 [tests.md](./tests.md)；mock 見 [mocking.md](./mocking.md)。

## Seams

Seam 是可從外部觀察行為的公開邊界。沿用使用者、已核准 spec／tickets 或既有會話確定的 seams，不重複要求確認。若仍有影響範圍的重要選擇，列出候選並釐清：「公開介面是什麼？要測哪些 seams？」每個候選用一句話說明**能抓到什麼、漏掉什麼**；使用者已授權自行決定時，在該範圍內選擇並說明。

介面本身尚未確定時，先看相關公開介面、呼叫端及既有設計文件，說明模組責任、測試邊界與取捨；不要求安裝另一個 skill 才能進行。

## 反模式

- **實作耦合**：mock 內部協作者、測 private、走側門查 DB 等——重構就紅但行為沒變。
- **套套邏輯**：期望值用與程式相同方式算出來——永遠不會抓錯。
- **橫向切片**：一次寫完全部測試再實作——改成垂直：一測→一實作→重複。

## 迴圈規則

- **先紅後綠**：先寫失敗測試，再寫剛好夠過的碼。
- **一次一個切片**：一個 seam、一測、一最小實作。
- **重構不在此迴圈**：留給 `gs-code-review` 階段，不塞進 red→green。

## 結束時

```
### 下一步建議
若仍有未完成切片：繼續下一輪 red→green，或回到 `/gs-implement`。
若本段功能已完成：建議 `/gs-code-review`。
```
