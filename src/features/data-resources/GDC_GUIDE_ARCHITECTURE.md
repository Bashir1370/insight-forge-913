# GDC Guide Architecture

This document is the source-of-truth map for the active GDC learning flow.

## Public route

`/resources/gdc`

Route file:

`src/routes/resources_.gdc.tsx`

Active component chain:

`GdcResourcePage`
→ `GdcQuestionGuidePage`
→ `GdcQuestionOneGuide` or `GdcQuestionTwoGuide`
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

## Question 2 stages

Question 2 owns its navigation in `GdcQuestionTwoGuide.tsx` and continues from Project selection into Cohort construction.

1. **Enter Cohort Builder**
   - UI: `GdcCohortBuilderIntroStage.tsx`
   - Admin: `GdcCohortBuilderIntroAdminEditor.tsx`
   - Config: `gdc-cohort-builder-intro-config.ts`
   - Image loader: `gdc-cohort-builder-intro-image.ts`
   - Owns: the real GDC entry screenshot, the two Cohort Builder entry hotspots, and the three-slide introduction.

2. **Learn the Cohort Builder filter map**
   - UI: `GdcCohortBuilderFiltersStage.tsx`
   - Admin: `GdcCohortBuilderFiltersAdminEditor.tsx`
   - Config: `gdc-cohort-builder-filters-config.ts`
   - Context: `GdcCohortBuilderFiltersContext.tsx`
   - Default screenshot: `public/images/gdc/gdc-cohort-builder-filters.webp`
   - Owns: all left-sidebar Cohort Builder categories, one slide per category, and one stage-scoped hotspot per active slide.

3. **Learn the fields inside each Cohort Builder category**
   - UI: `GdcCohortFieldGuideStage.tsx`
   - Admin: `GdcCohortFieldGuideAdminEditor.tsx`
   - Config: `gdc-cohort-field-guide-config.ts`
   - Context: `GdcCohortFieldGuideContext.tsx`
   - Default General screenshot: reuses `public/images/gdc/gdc-cohort-builder-filters.webp` until replaced from the editor.
   - Owns: right-side category tabs, one or more vertically stacked screenshots per category, a delayed spotlight tutorial, and short hover/click explanations on filter titles.
   - The first implemented category is `General`, with Program, Project, Disease Type, Primary Diagnosis, Primary Site, Tissue or Organ of Origin, and Case ID.

### Question 2 interaction rules

- Stage 2 hotspots are contextual: a hotspot is shown only on the slide that teaches that exact sidebar category.
- Stage 3 filter-title targets remain visually quiet until the learner hovers/focuses/clicks them.
- When a Stage 3 category is opened for the first time, after about two seconds the configured spotlight field is isolated while the rest of the screenshot is dimmed and a short interaction instruction appears.
- Stage 3 supports multiple screenshots stacked vertically inside one category for categories with many filters.
- Admin editors must remain the source of truth for screenshots, filter descriptions, clickable title geometry, and spotlight geometry.

## Page and data wrappers

- `GdcResourcePage.tsx`: loads persisted GDC resource data and admin state.
- `GdcQuestionGuidePage.tsx`: connects providers/configuration and shared guide styles.
- `GdcQuestionOneGuide.tsx`: owns Question 1 navigation and renders its five named stages.
- `GdcQuestionTwoGuide.tsx`: owns Question 2 navigation and renders its named Cohort stages.
- `gdc-question-guide.css`: shared visual rules that are truly common across stages.

## Legacy questions

Questions 3–5 still use the older guide temporarily through:

- `GdcLegacyQuestionBridge.tsx`
- `GdcQuestionDrivenGuideV3.tsx`

Questions 1 and 2 must **not** use the legacy bridge for their active named stages.

## Naming rule for future work

Do not add new files named `V7`, `V8`, `StageOnePolish`, `cleanup`, or DOM-enhancer variants.

New functionality should live in the component that owns the concept, for example:

- Question 1 Stage 1 visual change → `GdcDiscoverProjectsStage.tsx`
- Question 1 Stage 1 admin change → `GdcDiscoverProjectsStageAdminEditor.tsx`
- Question 1 Stage 5 change → `GdcProjectSummaryReadingStage.tsx` / `GdcProjectSummaryAdminEditor.tsx`
- Question 2 Stage 1 change → `GdcCohortBuilderIntroStage.tsx` / `GdcCohortBuilderIntroAdminEditor.tsx`
- Question 2 Stage 2 change → `GdcCohortBuilderFiltersStage.tsx` / `GdcCohortBuilderFiltersAdminEditor.tsx`
- Question 2 Stage 3 change → `GdcCohortFieldGuideStage.tsx` / `GdcCohortFieldGuideAdminEditor.tsx`

Avoid MutationObserver/DOM patching for stage UI. Implement interaction directly in React state/components.
