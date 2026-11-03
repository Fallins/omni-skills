# Design-to-code playbook

Use this playbook only for a UI slice with a user-approved design. It composes with the shared [design workflow contract](../../../docs/contracts/design-workflow.md); it does not create a second planning or coordination process.

## Gate: approved design and mapped work

Before writing, verify that the Plan and TaskContract identify:

- the exact DesignSpec revision and a reference to the user's actual approval, including any conditions;
- a DesignImplementationMap mapping every in-scope screen, state, interaction, UXAcceptance, and LayoutAcceptance to native components/files, APIs/data, and verification evidence;
- current repo architecture, tokens, component APIs, owned files, and shared-resource writer; new paths/APIs are marked proposed until verified;
- unresolved decisions, dependencies, and acceptance. Missing approval or a material gap blocks the affected slice and returns to Plan; the implementer does not fill product decisions by guesswork.

## Implement the mapped behavior

1. Match existing design-system components and tokens. Implement the mapped hierarchy, container boundaries, margins/padding, group/section/column spacing, typography, control dimensions, icon alignment, and responsive behavior in native product code; do not copy prototype-only offsets or invent global spacing values.
2. Follow the approved screen/state map through the complete journey, including back/forward, cancel/close, retry/refresh, loading/success/error/empty states, input/selection/scroll preservation, and recovery. Keep data/API and interaction behavior aligned with the Plan contract.
3. Cover the mapped content and viewport cases: long/multiline/unbreakable content, narrow/medium/wide widths, zoom/reflow, overflow, overlays, dialogs, sticky controls, and mobile keyboard/safe areas as applicable. A prototype or screenshot is a reference, not proof that the implemented app behaves the same.
4. If the codebase or verified behavior conflicts with the approved design, stop the affected slice and report the exact contract, evidence, impact, and affected requirements. Route product decisions or material visual/interaction changes to Plan and design review; do not silently diverge or ask another writer to overlap.

## Handoff and evidence

Report the implemented DesignSpec revision, mapped screens/states, actual components/files, deviations, and per-criterion checks. Hand journey evidence to `verify-change`; keep UXAcceptance and LayoutAcceptance results distinct. Record viewport and content case for layout evidence. If only static or synthetic evidence exists, say so. Do not claim browser, accessibility-standard, or real-user acceptance without matching evidence. Overall completion remains governed by the shared CompletionDecision and active coordinator's final integration acceptance.
