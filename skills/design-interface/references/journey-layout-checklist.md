# Journey and layout review checklist

Use only applicable rows. Record evidence or mark the check not applicable with a reason. Project design tokens and platform standards take precedence over generic examples.

## Journey and interaction

- Identify entry, intended completion, exit, navigation, and the user's next action on every screen.
- Cover relevant loading, empty, success, failure, permission, and partial states; explain retry and recovery.
- For back/forward, cancel/close, refresh, and retry, specify what happens to typed input, filters, selected items, scroll, and in-flight work. Confirm before destructive or unrecoverable actions.
- Prevent unclear repeated submission; give timely status and actionable errors without losing recoverable input.
- Check keyboard order, visible focus, labels, dialog focus entry/return, touch use, and non-color state cues where applicable.
- Check the whole journey as connected states; do not infer usability from a page gallery or prototype alone.

## Layout and content

- Name each tested viewport using the target device/browser or project breakpoint. Include narrow, medium, and wide cases where the product supports them, including behavior just before/after a breakpoint when useful.
- Record the actual design tokens or approved values for page edge margin, max-width container, inner padding, group spacing, section spacing, column gap, typography/line height, control height, icon baseline, and alignment. Check consistent controls and balanced density.
- Exercise long and multiline titles, long body copy, localization growth, unbreakable identifiers, many items, zero items, inline validation, error banners, and text zoom/reflow.
- Check wrapping, clipping, truncation recovery, horizontal/vertical overflow, hidden or sticky controls, dialogs/menus, nested scrolling, mobile keyboard, and safe areas.
- Capture viewport-identified screenshots or equivalent layout evidence, plus measurements for important boundaries and gaps. Note test data and environment.

## Separate acceptance

- UXAcceptance: a criterion per meaningful journey/state transition, with observed result and recovery path.
- LayoutAcceptance: a criterion per viewport/content stress case, with screenshot or measured geometry and any overflow/obstruction result.
- Mark blocked checks explicitly. A successful geometry check is not a complete product-design review. A synthetic fixture is not a real-user study, and source inspection is not browser evidence.
