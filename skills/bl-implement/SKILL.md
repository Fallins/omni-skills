---
name: bl-implement
description: >-
  Implement work from a spec or tickets using bl-tdd, then bl-code-review.
  Manual invoke only (/bl-implement).
disable-model-invocation: true
---

# bl-implement

## 語言

與使用者對話一律使用**繁體中文**。

## 指示

依使用者指定的 **spec** 或 **tickets** 實作。

1. Read 套件 `docs/agent-work-and-setup.md`；執行 **缺 setup 閘門**（無 `AW/issue-tracker.md` 則提示 **`/bl-setup`** 或「幫我 setup」）。
2. 讀取 spec／tickets 全文；路徑依 `AW/issue-tracker.md`（Local → agent-work）或使用者給的路徑。**查找一律到 `AW/`**，不要業務 repo `.scratch`／`docs/agents/`。
3. 用 Read 遵循 `~/.cursor/skills/bl-tdd/SKILL.md`：先與使用者確認 seams，再以 red→green 推進。
4. 實作期間定期跑型別檢查與相關單測；收尾跑完整測試套件（專案慣例指令，如 `bun run check`）。
5. 完成後用 Read 遵循並執行 `~/.cursor/skills/bl-code-review/SKILL.md`（對這次變更做雙軸 review）。
6. **Commit**：若使用者未明確要求 commit，只整理建議的 commit message 並請使用者確認後再提交；若使用者已要求 commit／完成實作並提交，再依專案慣例提交。

## 結束時

```
### 下一步建議
若 review 仍有必修項：繼續修補後再跑 `/bl-code-review`。
若已通過：可結束；換 session 時可用 `/bl-handoff`。
```
