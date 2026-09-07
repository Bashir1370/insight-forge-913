# GDC Guide Architecture

This document is the source-of-truth map for the active GDC learning flow.

## Public route

`/resources/gdc`

Route file:

`src/routes/resources_.gdc.tsx`

Active component chain:

`GdcResourcePage`
→ `GdcQuestionGuidePage`
→ `GdcQuestionOneGuide`
→ one named stage component

## Question 1 stages

1. **Find the data scope / start from Projects**
   - UI: `GdcDiscoverProjectsStage.tsx`
   - Admin: `GdcDiscoverProjectsStageAdminEditor.tsx`
   - Owns: real GDC screenshot, Projects hotspot, inspector copy, zoom lens, architecture map.

2. **Read the Projects page**
   - UI: `GdcProjectsStage.tsx`
   - General content/admin: `GdcQuestionGuideAdminEditor.tsx`
   - Facet panels: `GdcFacetPanelsAdminEditor.tsx`

3. **Study design and filters**
   - UI: `GdcStudyDesignStage.tsx`
   - Admin: `GdcStudyDesignAdminEditor.tsx`

4. **Evaluate final projects**
   - UI: `GdcProjectDecisionStage.tsx`
   - Admin: `GdcProjectDecisionAdminEditor.tsx`

5. **Read project information / Project Summary**
   - UI: `GdcProjectSummaryReadingStage.tsx`
   - Admin: `GdcProjectSummaryAdminEditor.tsx`

## Page and data wrappers

- `GdcResourcePage.tsx`: loads persisted GDC resource data and admin state.
- `GdcQuestionGuidePage.tsx`: connects providers/configuration and shared guide styles.
- `GdcQuestionOneGuide.tsx`: owns Question 1 navigation and renders the five named stages.
- `gdc-question-guide.css`: shared visual rules that are truly common across stages.

## Legacy questions

Questions 2–5 still use the older guide temporarily through:

- `GdcLegacyQuestionBridge.tsx`
- `GdcQuestionDrivenGuideV3.tsx`

Question 1 must **not** depend on the legacy bridge.

## Naming rule for future work

Do not add new files named `V7`, `V8`, `StageOnePolish`, `cleanup`, or DOM-enhancer variants.

New functionality should live in the component that owns the concept, for example:

- Stage 1 visual change → `GdcDiscoverProjectsStage.tsx`
- Stage 1 admin change → `GdcDiscoverProjectsStageAdminEditor.tsx`
- Stage 5 change → `GdcProjectSummaryReadingStage.tsx` / `GdcProjectSummaryAdminEditor.tsx`

Avoid MutationObserver/DOM patching for stage UI. Implement interaction directly in React state/components.
