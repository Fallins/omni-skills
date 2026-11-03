---
name: design-interface
description: Turn a Plan-provided UI DesignBrief into a reviewable interface specification and prototype, then wait for the user's explicit design decision before returning to Plan. Use for new or materially changed user journeys, layouts, or interactions.
---

# Interface design

This is a design stage between Plan and implementation. Read the shared [design workflow contract](../../docs/contracts/design-workflow.md). Do not implement product code or take over task coordination.

1. Confirm the DesignBrief has bounded goals, non-goals, requirements, journey, constraints, existing product UI/tokens, states, and a clear review question. If key product decisions are missing, return them to Plan instead of guessing.
2. Inspect relevant existing screens, components, and tokens. Preserve the established visual language and interaction conventions unless the brief explicitly authorizes a change. Design the whole journey, not isolated screens.
3. Specify each relevant state and transition, including back/forward, cancel/close, retry/refresh, loading/success/error/empty, and whether inputs, filters, selection, and scroll survive navigation. Make errors actionable and provide recovery. Account for keyboard/focus, labels, touch targets, focus return, and accessible state cues appropriate to the platform.
4. State project-specific page margins, container width and padding, group/section/column spacing, typography and line-height, control sizes, icon baselines, and alignment. Reuse actual tokens; do not invent global pixel rules or repair geometry with arbitrary offsets. Check realistic narrow, medium, and wide layouts, long titles/text, unbreakable strings, many/empty/error items, zoom/reflow, overlays, and mobile keyboard/safe-area behavior when relevant.
5. Deliver a reviewable sketch, annotated frames, or clickable prototype with a DesignSpec revision. Mark mock data and nonfunctional controls. Keep UXAcceptance (journey and recovery) separate from LayoutAcceptance (named viewport, content case, measurements, and evidence). An image alone is not a complete interaction or responsive specification.
6. Ask the user to approve or request changes to the exact revision. Record the actual decision reference and conditions. Do not mark approved from silence, an ambiguous response, or your own assessment. If changes are requested, revise and review a new revision. After explicit approval, return to Plan so it can create/update the DesignImplementationMap, task contracts, dependencies, and acceptance coverage. Implementation does not start in this skill.

Do not claim usability, real-user, browser, or accessibility-standard validation without the corresponding evidence. Use [journey and layout checklist](references/journey-layout-checklist.md) when the surface has multiple states or responsive behavior.
