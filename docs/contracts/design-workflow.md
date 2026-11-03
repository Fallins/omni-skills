# Design workflow contract

This shared contract connects planning, design review, implementation, and acceptance. It records references and decisions; it does not replace a product's design system or prescribe global pixel values.

## DesignBrief (Plan → design)

The planner supplies a bounded brief with:

- requirement IDs, user goal, audience/context, non-goals, and success conditions;
- the end-to-end journey, entry/exit points, relevant existing screens/components/tokens, and known constraints;
- expected screen and state coverage, including empty, loading, success, failure, retry, and permission states where applicable;
- unresolved product decisions, what the user is being asked to review, and how approval will be recorded.

Do not ask the designer to invent product rules that belong in Plan.

## DesignSpec (design → user review → Plan)

Keep the reviewable artifact (sketch, annotated frames, or clickable prototype) tied to a DesignSpec revision. Record:

- `design_id`, revision, status (`draft`, `awaiting-review`, `approved`, `revision-requested`, `superseded`), and the real user decision reference for an approved revision;
- screen × state inventory and the full user journey, with back, forward, cancel/close, retry/refresh behavior and which inputs, filters, selection, and scroll position are preserved or reset;
- existing components and design tokens used, plus page margins, container max width, container padding, within-group and between-section spacing, column gaps, typography/line height, control dimensions, icon baseline and alignment;
- responsive rules for the project's relevant narrow, medium, and wide viewports, content reflow/overflow behavior, and long-content cases;
- interaction, data, keyboard/focus, accessibility, error recovery, and any mock-versus-live boundary;
- separate `UXAcceptance` criteria for journey/behavior and `LayoutAcceptance` criteria for measurable geometry at named viewports, with evidence to collect.

Spacing, breakpoints, and dimensions must come from project tokens or an explicit design decision. Do not imply a universal spacing scale. A prototype is not the production app and an image alone does not define interactions or responsive behavior.

Approval is a user decision, not an agent-generated status. Save the decision reference, approved revision, and any conditions. If approval is missing, ambiguous, or requests changes, keep the design unapproved and return to Plan for the next step. Never infer approval from silence or a positive reaction to only part of the artifact.

## DesignImplementationMap (approved design → code)

After approval, Plan must map the affected design to implementation before coding. The map is a required contract, but its form scales with the task:

- **Light:** embed a concise mapping in the task card; do not require a separate document. Cite the exact approved DesignSpec revision and actual user-decision reference. Cover every in-scope screen/state and interaction, its native component/file or verified implementation location, separate UXAcceptance and LayoutAcceptance criteria, and the verification method.
- **Large:** include a complete DesignImplementationMap in the Plan/TaskContracts. Map every approved screen/state and acceptance criterion to its owner, native component/file, data/API contract, interaction, verification method, and integration task. Keep the mapping tied to the exact approved DesignSpec revision and decision evidence.

Both forms must account for every affected state and acceptance criterion; task size changes the level of documentation, not coverage. Missing approval, a missing state/interaction/implementation location, or either acceptance track blocks the affected slice. If code reveals a material mismatch, stop that slice and route the change through Plan and, when user-visible design changes, another user review.

## Acceptance boundary

`UXAcceptance` asks whether a person can complete the intended journey, recover from errors, and understand system state. `LayoutAcceptance` checks layout evidence at the specified viewports and content stress cases: measured margins/containers/gaps/alignment, wrapping, clipping, overflow, and obstructed controls. Passing one does not imply passing the other. Static inspection, a prototype, synthetic data, or a model's opinion is not evidence of real-user testing or browser acceptance.
