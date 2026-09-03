# HubGene — Project Master Context

**Updated:** 2026-09-03  
**Repository:** `Bashir1370/insight-forge-913`  
**Primary branch:** `main`  
**Purpose:** the single Markdown source for HubGene product decisions, scientific-learning standards, architecture, recovery notes, stabilization status, and the current development direction.

> GitHub source code is the implementation source of truth. This file is the single human-readable project context intentionally kept in the repository.

---

## 1. Product identity

**HubGene / هاب‌ژن** is a Persian-first bioinformatics and computational-biology platform for life-science researchers.

Core product model:

> **Learn → Design → Consult → Analyze**

Core scientific principles:

> **سؤال → مفهوم → تصمیم → ابزار**

> **قابل اجرا بودن ≠ مناسب بودن**

> **Clarity = Trust**

HubGene should help a researcher understand the scientific problem, evidence, limitations, data source, and analysis structure before presenting software as the solution.

Primary early persona:

- life-science MSc-level learner/researcher,
- little or no programming experience,
- wants enough understanding to make correct research decisions,
- does not need to become a programmer before understanding bioinformatics.

Educational default:

> **Concept → Purpose → Input → Output → Checks → Mistakes → Tools**

---

## 2. Approved top-level product architecture

HubGene now separates three different questions that should not be forced into one hierarchy:

1. **Learning Domains** — what scientific area am I learning?
2. **Data Resources** — where do I find and understand biological data/resources?
3. **Analysis & Tools** — what do I do with the data?

Conceptual model:

```text
HubGene
├── Learning Domains
│   ├── Transcriptomics
│   ├── Genomics
│   ├── Epigenomics
│   ├── Proteomics
│   └── Metabolomics
├── Data Resources
│   ├── Databases
│   ├── Repositories
│   ├── Archives
│   ├── Data Portals
│   ├── Browsers
│   └── Knowledgebases
└── Analysis & Tools
    ├── R
    ├── Python
    ├── Statistical analysis
    └── Reproducible workflows
```

### Architectural principle: one canonical resource, many entry points

A resource such as GDC/TCGA must have **one canonical educational home** under Data Resources. It can then be linked contextually from RNA-seq, Genomics, Cancer Biology, future project modules, and other relevant places.

Do not duplicate the same GDC/GEO/PRIDE tutorial inside several Omics trees.

This is a graph-like learning architecture rather than a rigid parent/child tree.

### Main Omics pillars

1. Transcriptomics
2. Genomics
3. Epigenomics
4. Proteomics
5. Metabolomics

### Cross-cutting analysis/research capabilities

Examples:

- Experimental Design
- Statistics
- Public Data Research
- Functional Analysis
- Network Biology
- Biomarker Discovery
- Visualization
- Biological Interpretation
- Machine Learning
- Multi-omics Integration

### Important classification rules

- **Bulk RNA-seq is not a top-level Omics pillar.** It is a measurement/learning path inside Transcriptomics.
- **Single-cell RNA-seq** is fundamentally a Transcriptomics modality, while a future cross-omics Single-cell hub may also connect scATAC-seq/Multiome.
- **Network Biology, Biomarker Discovery, and Public Data Research are cross-cutting paths**, not Omics pillars.
- **Microbiome is a research domain**, not simply another item at the same level as the five Omics pillars.
- A resource may belong to several scientific contexts; ownership is represented by metadata/relations rather than duplicating content.

---

## 3. Data Resources — approved architecture

**Data Resources** is a first-class HubGene pillar, independent from RNA-seq or any single Omics domain.

Its purpose is not to become a static directory of links. It should teach researchers:

- what a resource is,
- what kinds of data/knowledge it contains,
- when it is useful,
- how its interface is organized,
- how to complete realistic research tasks in it,
- what common mistakes occur,
- how outputs from the resource connect to downstream analysis.

### Resource types

Current generic types:

```text
data-portal
repository
archive
browser
knowledgebase
database
```

A resource should also carry relationships such as:

```text
domains
modalities
topics
relatedLearning
relatedAnalyses (future)
```

Examples:

```text
GDC / TCGA
  domains: Transcriptomics, Genomics, Cross-omics
  modalities: Bulk RNA-seq, WXS, WGS, Copy Number, ...
  topics: Cancer, TCGA, Clinical metadata, Public/Controlled data

PRIDE
  domains: Proteomics
  modalities: Mass-spectrometry proteomics

GEO
  domains: Transcriptomics, Epigenomics
  modalities: Bulk RNA-seq, Microarray, Single-cell, Functional genomics
```

### Canonical resource-learning structure

Preferred content progression:

```text
Overview
→ What data/knowledge is here?
→ Interface Tour
→ Guided Tasks
→ Data Access
→ Common Mistakes
→ Use in Analysis
→ Related Resources / Learning
```

### Resource Learning Engine

The UI/runtime must be generic rather than coded separately for each website.

Core content model:

```text
Resource
PortalScreen
Hotspot
GuidedStep
GuidedTask
Relations
```

Hotspots must use **normalized relative coordinates** (`x`, `y`, `width`, `height`) rather than fixed pixels, so overlays remain aligned as the image scales responsively.

### Interface-training pattern

Default first implementation:

```text
reference screenshot / visual asset
+ normalized hotspots
+ guided explanation panel
+ previous/next progress
+ why-it-matters
+ common mistake
+ next action
+ task-based mission
+ “open real site” link
```

Do **not** make live iframe embedding the default architecture. External portals can change, block embedding, or produce unstable learner experiences. HubGene should own the educational state and use a stable visual reference, with a clear link to the official live portal.

### Resource authoring direction

The original plan was to postpone a second CMS schema until the first GDC UX was validated. A focused **Resource Tour Visual CMS** was subsequently implemented for GDC because the visual-positioning and content-authoring workflow itself became part of the MVP validation.

The current focused authoring layer can:

- upload/replace a resource screenshot,
- place and resize hotspots visually,
- edit structured teaching content for each hotspot,
- edit page-level title/description content,
- persist managed overrides in Supabase,
- preserve code-backed defaults as a fallback.

This does **not** mean a fully generic multi-resource CMS is finished. Before generalizing to GEO/SRA/other resources, validate the GDC workflow and extract only the parts that are genuinely reusable.

Longer-term goals still include:

- create/edit a Resource,
- define tasks/scenarios,
- add quizzes/checkpoints beyond the current hotspot exercise pattern,
- connect a Resource to several scientific learning paths,
- publish/version resource revisions without code deployment.

---

## 4. Data Resources MVP — implementation checkpoint

Original feature branch:

```text
feature/data-resources-mvp
```

Original base branch:

```text
stabilization/security-ci-2026-08-23
```

The Data Resources implementation and subsequent GDC Visual CMS work are now present on `main`.

Current routes:

```text
/resources
/resources/$slug
/admin/resource-tours
```

Primary navigation exposes:

```text
منابع داده
```

Key implementation files now include:

```text
src/features/data-resources/resource-catalog.ts
src/features/data-resources/GuidedPortalTour.tsx
src/features/data-resources/gdc-home.tsx
src/features/data-resources/gdc-dynamic-page.tsx
src/features/data-resources/resource-tour-model.ts
src/features/data-resources/resource-tour-loader.ts
src/features/data-resources/resource-tour-admin-service.ts
src/features/data-resources/VisualPageEditor.tsx
src/features/data-resources/VisualAssetEditor.tsx
src/features/data-resources/VisualContentEditor.tsx
src/features/data-resources/HotspotContentEditor.tsx
src/routes/resources.tsx
src/routes/resources.$slug.tsx
src/routes/admin_.resource-tours.tsx
src/components/site/header.tsx
```

### Resource Explorer

`/resources` currently provides:

- independent Data Resources positioning,
- text search,
- Omics/domain filtering,
- resource-type filtering,
- active/planned status,
- reusable resource cards.

Initial catalog:

```text
GDC / TCGA — active MVP
GEO — planned
SRA — planned
GTEx — planned
PRIDE — planned
Ensembl — planned
cBioPortal — planned
UniProt — planned
```

This list is an initial development map, not a claim that these are the final or only important resources.

### Generic GuidedPortalTour and current GDC runtime

`GuidedPortalTour.tsx` established the reusable interaction pattern with:

- interactive hotspots,
- normalized overlay coordinates,
- selectable guided steps,
- why-it-matters text,
- common-mistake callouts,
- next-action guidance,
- progress indicator,
- previous/next controls,
- external link to the official resource,
- a wireframe fallback when no screenshot asset is available.

The current GDC page uses the richer `GdcHomeTour` runtime while preserving the same conceptual engine. It now supports a fixed approved GDC screenshot plus Supabase-managed overrides.

Current visual state:

- default screenshot: `/images/gdc/gdc-home-clean.webp`,
- an admin can upload a new image to the `learning-media` bucket or save a direct image URL,
- hotspot geometry is percent-based and responsive,
- a fallback educational portal mock is shown if the screenshot fails,
- Supabase-managed image/content/hotspots override defaults without deleting the code-backed fallback model.

---

## 5. GDC / TCGA — first Resource MVP

GDC is the first resource used to validate the Data Resources architecture.

Official GDC documentation was rechecked on 2026-08-23 before finalizing the teaching model.

Verified current concepts:

- the GDC Data Portal is cohort-centric,
- **Analysis Center** is the central hub for portal tools and analyses,
- **Projects** supports project-level exploration,
- **Cohort Builder** filters **cases** and creates/changes the active cohort,
- **Repository** browses/downloads files associated with the active cohort and applies **file-level filters**,
- Repository filters include concepts such as Experimental Strategy, Data Category, and Data Type,
- a core teaching distinction is **case/cohort filtering vs file filtering**.

This distinction must remain explicit in HubGene because it prevents a common conceptual error.

Current GDC homepage hotspots:

```text
Analysis Center
Projects
Cohort Builder
Repository
Global Search
Data Portal Summary
Cases by Major Primary Site
```

Initial task-based mission:

> **Find RNA-seq data for a TCGA project and explain the path from project/cohort selection to the relevant files.**

Teaching flow:

```text
project context
→ define/activate cohort
→ Repository
→ Experimental Strategy = RNA-Seq
→ Data Category / Data Type
→ inspect files + metadata
→ downstream analysis handoff
```

The learner should finish understanding the difference between:

```text
project
cohort
case
sample/biospecimen
file
```

### Structured Persian hotspot learning content — 2026-08-27 milestone

The seven GDC hotspots now use a shared structured learning model. The **English hotspot title remains aligned with the real GDC interface**, while Persian teaching content is editable separately.

Current hotspot teaching fields:

```text
title (English interface term)
persianLabel
description / «در یک جمله»
whyItMatters
researchExample
commonMistake
exerciseQuestion
exerciseAnswer
action / connection to next step
x, y, width, height
```

The learner-facing GDC step card now renders:

- English interface title,
- Persian educational label,
- one-sentence explanation,
- why it matters,
- expandable research example,
- common mistake,
- “خودت امتحان کن” exercise with revealable answer,
- explicit connection to the next step.

The current admin editor includes a dedicated `HotspotContentEditor` so this structured Persian content can be changed without editing source code.

### Relationship to the real RNA-seq case study

GDC education and RNA-seq R analysis are separate canonical modules but should connect tightly.

Recommended learner path:

```text
Transcriptomics
→ Bulk RNA-seq
→ Data Resource: GDC / TCGA
→ find/understand the source dataset
→ Real RNA-seq Analysis with R
→ TCGA-LIHC Golden Template
```

The GDC module teaches **where the data comes from and how the portal works**. The R module teaches **how the selected/prepared data is analyzed**. HubGene does not need to become a high-cost remote compute server to teach either part well.

---

## 6. Transcriptomics blueprint

Transcriptomics is the first major scientific-learning pillar of HubGene.

Internal architecture:

```text
Transcriptomics
├── A. Foundations
├── B. Measurement Modalities
├── C. Analysis Paths
├── D. Interactive Labs
└── E. Project Application
```

Approved Foundation sequence:

| Code | فارسی | English |
|---|---|---|
| F1 | از ژنوم تا ترنسکریپتوم | Genome → Transcriptome |
| F2 | بیان ژن یعنی چه؟ | Gene Expression |
| F3 | RNA فقط mRNA نیست | RNA Types |
| F4 | ترنسکریپتومیکس چه چیزی اندازه می‌گیرد؟ | What Transcriptomics Measures |
| F5 | سؤال‌های قابل پاسخ با ترنسکریپتومیکس | Research Questions |
| F6 | Bulk، Single-cell و Spatial | Measurement Resolution |
| F7 | RNA-seq در این نقشه کجاست؟ | RNA-seq in Transcriptomics |

The foundation goal is a usable mental model, not memorized definitions.

Conceptual modality selection:

```text
What do you need to know about the transcriptome?
├── average signal in a sample/tissue → Bulk RNA-seq
├── variation between individual cells → Single-cell RNA-seq
├── expression plus spatial location → Spatial Transcriptomics
├── transcript/isoform structure → Long-read Transcriptomics
└── small RNAs → small RNA-seq
```

Tool selection comes after the biological question and measurement need.

---

## 7. Bulk RNA-seq conceptual path vs current implementation

Approved scientific mental map:

1. Research Question
2. Experimental Design
3. Sample → Sequencing / FASTQ
4. Quality Control
5. Quantification
6. Expression/Count Matrix
7. Normalization
8. Sample Exploration
9. Differential Expression
10. Visualization
11. Functional Analysis
12. Biological Interpretation

Current guided specialist implementation has 11 lessons:

1. Study design
2. Sample to RNA
3. Library preparation
4. Sequencing & FASTQ
5. Raw-data QC
6. Alignment & quantification
7. Count matrix
8. Sample-level QC
9. Normalization & differential expression
10. Biological interpretation
11. Integrated pancreatic cancer project

These are not a contradiction: the 12-stage list is the scientific mental map; the 11-lesson implementation groups/splits concepts for teaching.

Lessons 1–10 share `GuidedConceptLesson`; lesson 11 has integrated-project-specific CMS support.

---

## 8. Interaction-first learning standard

HubGene should be **interaction-first**, not text-first.

Preferred learning rhythm:

```text
Concept
↓
Deep Dive
↓
Visual / Data Example
↓
Mini Lab
↓
Decision Scenario
↓
Mistake Clinic
↓
Case Study
↓
Apply to My Project
↓
Mastery Checkpoint
```

Persian shorthand:

1. بفهم
2. عمیق‌تر شو
3. ببین
4. امتحان کن
5. تصمیم بگیر
6. اشتباه را پیدا کن
7. در یک Case Study ببین
8. به پروژه خودت وصل کن
9. ایستگاه تسلط

Aim for meaningful interaction every few minutes where it improves learning. Interaction is not synonymous with quiz.

Reusable patterns include:

- Decision Lab
- Data Inspector
- Compare Lab
- Build Lab
- Detect the Problem
- Interpretation Lab
- What Happens If...?
- Guided Portal Tour
- Guided Resource Task

Whenever useful, let the learner make a wrong decision and see its consequence rather than only displaying “wrong”.

---

## 9. Shared concepts

Concepts that should eventually be reusable across Omics include:

```text
Experimental Design
Biological Replicates
Technical Replicates
Metadata
Batch Effect
Covariates
Confounders
Multiple Testing
PCA
Clustering
Statistical Significance
Reproducibility
Biological Interpretation
Data provenance
Resource/database literacy
```

Principle:

> Build the core concept once, then show context-specific examples for each Omics domain.

---

## 10. Learning language and writing standard

HubGene is Persian-first and beginner-first without sacrificing scientific correctness.

Rules:

- Use a clear Persian equivalent when one is established and understandable.
- Keep standard scientific names/abbreviations such as RNA, DNA, RNA-seq, FASTQ, PCR, RIN, DV200 and Phred in scientific form.
- Do not add English terminology merely to sound more scientific.
- Introduce a specialist term only after explaining what it means and why it matters.
- Concept before tool; problem before software.
- Formula after meaning, not before it.
- Advanced details belong in a second layer unless required for the next decision.
- Each section should create the conceptual need for the next section.
- Each lesson should connect to the unresolved limitation/question from the prior lesson.

A new technical term should answer:

1. What is it?
2. Why is it needed here?
3. What goes wrong if I misunderstand it?

Preferred Persian terms include, where appropriate:

```text
read(s) → خوانش / خوانش‌ها
metadata → فراداده
biological replicate → تکرار زیستی
batch effect → اثر دسته‌ای
alignment → هم‌ترازی
mapping → نگاشت
count matrix → ماتریس شمارش
normalization → نرمال‌سازی
sample-level QC → کنترل کیفیت در سطح نمونه
differential expression → بیان افتراقی
covariate → هم‌متغیر
effect size → اندازه اثر
adjusted p-value → مقدار p تعدیل‌شده
false discovery rate → نرخ کشف کاذب
gene set → مجموعه ژنی
pathway → مسیر زیستی
```

Do not translate scientific names, file formats, software names, or common abbreviations when translation creates ambiguity.

---

## 11. Locked scientific teaching rules for RNA-seq

### Sample-level QC / PCA

- VST/rlog-style transformations are for exploratory sample relationships/visualization, not replacements for the count-based DE model.
- PCA is a low-dimensional summary; PC1/PC2 do not represent all variation unless they explain all variance.
- Distance/clustering/PCA are exploratory and must be interpreted with metadata.
- A distant sample is a trigger for investigation, **not an automatic exclusion rule**.
- Exclusion requires converging evidence from raw QC, mapping/quantification, metadata and/or laboratory records.
- Complete confounding between condition and batch cannot be repaired merely by adding both variables to a model.

### Normalization and DESeq2

- Standard DESeq2 teaching uses appropriate raw/estimated count inputs; TPM, VST and rlog are not substitutes for standard DESeq2 count input.
- Library scaling is handled in the count model; total count alone can be biased by composition effects.
- Biological replication is fundamental; technical files/paired-end reads are not biological replicates.
- Dispersion matters in the negative-binomial model.
- `~ batch + condition` is meaningful only when factors are distinguishable in the design.
- log2 fold change is effect direction/magnitude, not proof of biological importance.
- p-value is not the probability that the null hypothesis is true.
- adjusted p-value/FDR handles multiple testing; it is not “the probability this exact gene is false”.
- statistical significance and biological relevance must be interpreted together.

### Functional interpretation / ORA / GSEA

- A DEG list is not the final biological conclusion.
- A gene set is not necessarily the same thing as a biological pathway.
- ORA depends on both the selected gene list and a defensible background universe.
- ORA is sensitive to list definition/thresholds.
- GSEA uses a ranked list and is conceptually different from ORA.
- NES direction/magnitude does not by itself prove mechanistic pathway activation.
- leading-edge genes are major contributors to an enrichment signal, not proven causal genes.
- gene-ID mapping, species, source/database version and unmapped genes are part of reproducibility.
- overlapping gene sets can create redundant significant results.
- multiple testing/FDR also applies at gene-set level.
- in bulk RNA-seq, immune/stromal enrichment may reflect cell-composition change, within-cell expression change, or both.
- biological interpretation should be phrased as a hypothesis consistent with the evidence unless independent evidence supports causality.

### Integrated pancreatic-cancer lesson

Lesson 11 is a **simulated educational scenario**, not real patient data and not a published study result.

Preserved rules:

- the independent biological unit is the patient/sample, not FASTQ files, Read 1/Read 2, or technical replicates,
- RIN alone is not a universal deletion threshold,
- adapter warning alone is not a deletion rule,
- reference genome, annotation and quantification logic should be consistent/versioned across samples,
- count-matrix columns must match metadata identifiers,
- sample removal requires converging technical evidence,
- appropriate counts feed the DE model,
- gene-set interpretation generates hypotheses rather than proving cellular origin or causality,
- final reporting should record inputs, versions, parameters, QC decisions, excluded samples/reasons, model, complete outputs and limitations.

Numbers in the simulated lesson are examples, not universal thresholds.

---

## 12. Route strategy

Important current routes include:

```text
/learn
/learn/rna-seq
/learn/rna-seq/navigator
/learn/rna-seq/project
/resources
/resources/$slug
/dashboard
/admin
/admin/content
/admin/resource-tours
/consultation
```

Although the conceptual hierarchy is now:

```text
Transcriptomics → Bulk RNA-seq
```

existing `/learn/rna-seq...` URLs are tied to deep links, progress and application state. Do not migrate URLs merely for naming purity.

Principle:

> Stabilize scientific architecture and learner experience first; migrate URLs later if the benefit justifies the cost.

### Admin route rule after GDC editor routing fix

Operational admin remains:

```text
src/routes/admin.tsx
→ /admin
```

The GDC Resource Tour editor is deliberately a **standalone admin page**, not content appended through an `<Outlet />` inside the large operational admin dashboard.

Current file-route implementation:

```text
src/routes/admin_.resource-tours.tsx
```

Rendered browser URL:

```text
/admin/resource-tours
```

Important TanStack convention:

- the `_` in the filename/route id is used to break layout nesting,
- it is **not** part of the desired browser URL,
- links must use `/admin/resource-tours`, not `/admin_/resource-tours`,
- do not re-add an `<Outlet />` to `admin.tsx` merely to make this editor render,
- do not create a competing nested route that maps to the same rendered URL.

The admin-only “ویرایش GDC” button in `gdc-dynamic-page.tsx` currently links to `/admin/resource-tours`.

Generated `src/routeTree.gen.ts` is a TanStack-generated artifact and should not be manually edited as the source of a routing fix; route generation should come from the file-route structure during dev/build.

---

## 13. Current technology stack

- React 19
- TypeScript
- TanStack Router / TanStack Start
- Vite 8
- Bun
- Tailwind CSS 4
- Supabase
- Cloudflare Workers
- GitHub
- Lovable-connected repository

Important scripts:

```text
bun run dev
bun run build
bun run build:dev
bun run preview
bun run lint
bun run typecheck
bun run format
```

`typecheck` runs `tsc --noEmit`. TypeScript strict mode is enabled.

---

## 14. Lovable / Git history safety

This repository is connected to Lovable.

**Do not rewrite published Git history.**

Avoid force pushing or replacing already-pushed shared history through rebase/amend/squash workflows.

Preferred workflow:

1. branch from a known safe base,
2. focused commits,
3. pull request,
4. quality checks,
5. merge without rewriting published history.

---

## 15. Deployment

Cloudflare project:

```text
hubgene
```

Known production URL:

```text
https://hubgene.bashirmos70217.workers.dev
```

Build:

```text
bun run build
```

Current GitHub Actions deployment workflow:

```text
.github/workflows/deploy-cloudflare.yml
```

It runs on pushes to `main` and by manual `workflow_dispatch`.

Current deployment sequence:

```text
checkout
→ setup Bun
→ bun install --frozen-lockfile
→ bun run build
→ bunx wrangler@4 deploy --config .output/server/wrangler.json
```

The deploy step runs only when the GitHub Actions secret is available:

```text
CLOUDFLARE_API_TOKEN
```

If the token is missing, the workflow emits a warning and skips deployment after a successful build rather than failing with a misleading deploy error.

Important lessons:

> Build the TanStack Start application before Wrangler deploy. Skipping the build can lead to missing `@tanstack/react-start/server-entry` output.

> Deploy the Nitro-generated worker configuration (`.output/server/wrangler.json`) rather than assuming a root Wrangler config represents the built TanStack Start output.

`@lovable.dev/vite-tanstack-config` already provides the main TanStack/React/Tailwind/Nitro integration; do not duplicate those plugins casually.

---

## 16. Environment and repository security

Expected public/client configuration names include:

```text
SUPABASE_PROJECT_ID
SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
```

Rules:

- never commit service-role keys, database passwords, private API keys, tokens or production secrets,
- `VITE_...` values are client-exposed and must never contain secret credentials,
- secrets belong in Cloudflare/Supabase/GitHub secret configuration or a secure password manager.

### 2026-08-23 stabilization

The repository previously tracked a root `.env` file.

During stabilization:

- `.env` was removed from the branch,
- `.env` and `.env.*` were added to `.gitignore`,
- `.env.example` remains allowed,
- a safe `.env.example` was added.

Removing `.env` from the current tree does **not** erase it from existing Git history. If old values were active credentials, rotate/revoke them instead of rewriting Lovable-connected history.

---

## 17. Existing production-oriented workflows

HubGene contains product workflows beyond Learn:

- authentication/profile,
- project creation,
- researcher dashboard,
- operational admin dashboard,
- project stages/status,
- project files,
- messages,
- consultations,
- reports/results,
- quotes,
- invoices/payment state.

Preserve these during learning/resource refactors.

Known project statuses:

```text
submitted
scientific_review
design_confirmation
data_received
qc
analysis
interpretation
completed
cancelled
```

Known quote statuses:

```text
draft
sent
accepted
rejected
expired
cancelled
```

Known invoice statuses:

```text
draft
issued
paid
overdue
cancelled
```

Known quote-response RPC:

```text
respond_to_project_quote
```

There is no known `quote_approved` status.

---

## 18. Admin, Learning CMS, and Resource Tour Visual CMS

Operational admin:

```text
src/routes/admin.tsx
```

Learning-content admin:

```text
src/routes/admin_.content.tsx
```

Rendered URL:

```text
/admin/content
```

Learning CMS currently supports:

- draft editing,
- preview,
- publishing,
- revision history,
- restore revision to draft,
- text/question editing,
- image/video media,
- reusable terminology intro controls.

Key files:

```text
src/features/learning/cms/GuidedLessonCms.tsx
src/features/learning/cms/IntegratedProjectCms.tsx
src/features/learning/cms/TermsIntroCms.tsx
src/features/learning/cms/learning-content-service.ts
src/features/learning/cms/useStableGuidedLessonCms.ts
```

Complex React behavior remains in code; editable scientific content is structured CMS data.

### GDC Resource Tour Visual CMS

The Data Resources engine now has a focused database-backed authoring layer for GDC.

Standalone admin page:

```text
/admin/resource-tours
```

Route file:

```text
src/routes/admin_.resource-tours.tsx
```

Admin access checks both authentication and an `admin` row in `user_roles`. Non-admin users are redirected away from the editor.

Current editor capabilities:

- load persisted GDC Resource Tour state from Supabase,
- show safe defaults plus a warning if persistence is unavailable,
- upload screenshots directly to `learning-media`,
- save a screenshot URL,
- drag/resize hotspot geometry visually,
- save semantic hotspot keys and ordering,
- edit structured Persian hotspot teaching content,
- edit page-level title/description blocks,
- open `/resources/gdc` as a preview.

Key files:

```text
src/features/data-resources/resource-tour-model.ts
src/features/data-resources/resource-tour-admin-service.ts
src/features/data-resources/VisualAssetEditor.tsx
src/features/data-resources/VisualPageEditor.tsx
src/features/data-resources/HotspotContentEditor.tsx
src/features/data-resources/VisualContentEditor.tsx
```

This authoring layer is currently **GDC-focused**, not yet the final generic CMS for every Data Resource.

---

## 19. Learning CMS / progress data model

Repository migrations currently create CMS tables:

```text
learning_content_drafts
learning_content_published
learning_content_revisions
```

Storage bucket:

```text
learning-media
```

CMS RLS depends on:

```text
private.has_role('admin'::text)
```

The definition of `private.has_role` is not currently present in repository migration history.

Guided lessons use dual progress persistence:

- localStorage as device/offline fallback,
- Supabase `learning_progress` for authenticated users.

Cloud key:

```text
(user_id, research_line, node_id)
```

Guided learning line:

```text
rna-seq-learning
```

Current progress payload version is `2`.

Required future fix: answers are persisted by numeric section/option indexes while CMS can reorder content. Publishing should bind progress to a content revision/hash/version and define explicit migration/reset behavior for structural changes.

---

## 20. Supabase migration/type status

Known application tables include:

```text
profiles
projects
user_roles
project_messages
project_files
consultations
project_quotes
project_invoices
learning_progress
research_assessments
learning_content_drafts
learning_content_published
learning_content_revisions
resource_tours
resource_hotspots
resource_content_blocks
```

Known Storage buckets include:

```text
project-files
learning-media
```

Earlier repository migrations at the 2026-08-23 checkpoint:

```text
20260819164500_add_cross_device_learning_progress_state.sql
20260819170818_add_learning_content_cms.sql
20260819173349_optimize_learning_content_cms_policies.sql
```

Resource Tour migrations added afterward include:

```text
20260824213000_resource_tours_hotspots.sql
20260824220000_visual_content_blocks.sql
20260827201000_finalize_resource_tour_editor.sql
20260827211500_gdc_hotspot_learning_content.sql
```

Resource Tour persistence model now includes:

```text
resource_tours
  └── one row per resource slug / image metadata

resource_hotspots
  └── semantic hotspot_key + geometry + structured teaching fields

resource_content_blocks
  └── page-level editable key/value content
```

The finalization migration:

- adds/normalizes semantic `hotspot_key`,
- creates uniqueness on `(resource_id, hotspot_key)`,
- creates uniqueness on `(resource_id, key)` for content blocks,
- applies `updated_at` triggers,
- replaces the early permissive authenticated Resource Tour policies with admin policies based on `private.has_role('admin'::text)`,
- keeps public read access for Resource Tour content,
- seeds the GDC resource/hotspot/content records without overwriting already-saved admin values.

The later GDC learning-content migration adds structured Persian educational fields while preserving the English GDC interface labels.

### Remaining recovery/type gap

The broader recovery gap still exists:

- the first learning-progress migration alters a pre-existing `learning_progress` table,
- CMS and finalized Resource Tour policies depend on `private.has_role`,
- multiple production tables predate repository migration history,
- generated Supabase types contain only part of the live schema.

Safe stabilization decision remains:

- do not invent missing security-sensitive production schema,
- generated `src/integrations/supabase/types.ts` remains a generated artifact,
- compatibility widening is temporary where required.

When direct live-schema export is available:

1. export complete Supabase schema,
2. keep canonical schema backup,
3. reconcile old objects with migrations,
4. regenerate Supabase types,
5. remove compatibility widening,
6. verify RLS and `private.has_role`,
7. test clean replay in a disposable environment.

Do not invent security-sensitive schema just to make migration history look complete.

---

## 21. Browser R PoC and real RNA-seq direction

Current repo includes:

```text
src/features/transcriptomics-learning/rna-seq/BrowserRnaSeqPoc.tsx
```

It loads WebR in the browser and uses **synthetic technical demonstration data**, not TCGA. Treat it as a technical experiment, not the scientific case-study product itself.

Preferred real-study architecture uses scientifically curated fixed/precomputed snapshots rather than attempting heavy remote bioinformatics live in the browser.

First reusable Golden Template:

```text
TCGA-LIHC
```

Target flow:

```text
Research Question
→ Dataset / provenance
→ Metadata
→ Count Matrix
→ QC
→ Normalization
→ PCA
→ DESeq2
→ Volcano
→ Heatmap
→ Biological Interpretation
→ Pathway Analysis
→ Complete R Script
```

Rules:

- use appropriate count data for DESeq2,
- do not substitute TPM/FPKM for count-based DESeq2,
- show real data provenance and metadata,
- expose complete reusable R code,
- distinguish exploratory visuals from inferential evidence,
- connect biological interpretation to limitations/study design.

Planned progression after LIHC:

```text
TCGA-LIHC — foundational
TCGA-BRCA — intermediate
TCGA-LUAD — more advanced
```

A later “R for biologists” layer can reuse the same projects.

The Data Resources/GDC module should become the upstream provenance/data-discovery companion to this analysis experience.

---

## 22. Known technical debt

Non-blocking issues:

1. Learning CMS publish is not transactional.
2. Removing media from lesson content can leave orphaned Storage files.
3. Stable CMS hook duplicates a published-content fetch.
4. Learning progress is not bound to content revision.
5. Generated Supabase database types are stale; compatibility widening is temporary.
6. Several routes/components are very large (admin, dashboard, Navigator, Project Mode).
7. Resource Tour authoring is currently GDC-focused; generic multi-resource authoring still needs deliberate abstraction before GEO/SRA expansion.
8. Versioned screenshot/resource-page maintenance needs a deliberate content policy because external portals evolve.
9. The Resource Tour editor uses code-backed defaults plus database overrides; future versioning/publish states should be designed before many resources depend on the same tables.
10. Generated TanStack route-tree artifacts can appear stale in Git; do not manually patch them instead of fixing file-route structure and regenerating during build/dev.

Refactor when a milestone benefits from it, not merely because files are long.

Good decomposition boundaries:

- data-access/services,
- domain types,
- page sections,
- forms/editors,
- reusable operational components,
- learning runtime vs scientific content,
- Resource Learning Engine vs resource-specific content.

---

## 23. Quality gates and stabilization

Workflow:

```text
.github/workflows/quality.yml
```

Checks:

```text
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run build
```

Stabilization branch:

```text
stabilization/security-ci-2026-08-23
```

PR:

```text
#20 — Stabilize repository security and CI
```

Stabilization changes include:

- repository confirmed private while GitHub integration remains connected,
- `.env` removed from branch and ignored,
- safe `.env.example` added,
- `typecheck` script added,
- GitHub Actions quality workflow added,
- Supabase compatibility type added without guessed schema migrations,
- historical Markdown documentation consolidated into this single master file,
- other repository-level Markdown project documents removed.

Known quality state from that checkpoint:

- dependency installation succeeded in the first quality workflow run,
- `lint` failed,
- `typecheck` and `build` were therefore skipped.

This documentation update did not independently re-establish a green `quality.yml` run. Do not claim the quality workflow is green until a successful run is observed.

A separate Cloudflare deployment workflow now exists and should not be confused with the quality gate.

---

## 24. Documentation policy

`HUBGENE_PROJECT_MASTER.md` is the only general project Markdown document intended to remain.

For future milestones, update this file instead of creating dated backup/review Markdown files.

It should preserve:

- product decisions,
- scientific learning rules,
- architecture constraints,
- deployment/recovery knowledge,
- technical debt,
- current milestone and next direction.

Do not copy secrets or obsolete large code snapshots into documentation.

---

## 25. Recovery checklist

A full recovery requires more than the Git repository.

Minimum recovery assets:

```text
GitHub repository
+
Supabase schema/database backup
+
Supabase Storage backup/inventory
+
Cloudflare configuration
+
secure environment-variable backup
```

Recovery sequence:

1. restore/clone repository,
2. restore secrets from secure storage,
3. recreate/restore Supabase,
4. restore canonical schema and migrations,
5. restore data and Storage as required,
6. restore Cloudflare variables/secrets,
7. `bun install`,
8. `bun run lint`,
9. `bun run typecheck`,
10. `bun run build`,
11. deploy,
12. test auth, dashboard, admin, consultation, Learn, Data Resources, GDC editor/persistence, RNA-seq persistence, project files/messages, quotes and invoices.

For GDC Resource Tour recovery specifically, verify:

- `resource_tours`, `resource_hotspots`, `resource_content_blocks`,
- `learning-media` files referenced by resource screenshots,
- RLS/admin role behavior,
- `/resources/gdc`,
- `/admin/resource-tours`,
- image/hotspot/content save and reload.

Do not rely on a ChatGPT conversation as the only project backup.

---

## 26. Current development checkpoint — 2026-09-03

The previous checkpoint said to connect the GDC visual reference and postpone CMS wiring. That milestone has materially advanced.

Completed/implemented since the 2026-08-23 master snapshot:

1. GDC visual screenshot is connected to the learner-facing guided tour.
2. Hotspot geometry has a responsive visual drag/resize editor.
3. GDC Resource Tour persistence is connected to Supabase.
4. Page image can be uploaded to `learning-media` or supplied by URL.
5. Page-level title/description are editable and persisted.
6. Managed GDC values override the static guided tour while static defaults remain available as fallback.
7. GDC editor is a standalone admin page at `/admin/resource-tours`, separate from the large operational `/admin` dashboard.
8. Resource Tour RLS was tightened from early permissive authenticated policies to admin-role management policies.
9. Seven GDC hotspots now have structured Persian educational content with example, mistake, exercise, answer and next-step fields.
10. Cloudflare deployment automation was updated to build first and deploy the generated Nitro Worker config with Wrangler 4.

### Current next order

1. validate the complete GDC learner/admin workflow in production: load → edit → save → reload → learner-facing override,
2. calibrate hotspot positions and teaching text against the approved/current GDC visual reference and actual learner behavior,
3. complete/validate the first end-to-end task-based GDC mission around finding and understanding RNA-seq data,
4. document/version the external GDC screenshot/source context so future portal changes can be maintained safely,
5. only then generalize the Resource Tour authoring model for the next resource, with **GEO** as the leading candidate,
6. avoid creating a separate hard-coded GEO editor if the existing Resource Tour model can be generalized cleanly,
7. connect the validated GDC provenance/data-discovery experience to the **TCGA-LIHC real RNA-seq analysis with R** Golden Template,
8. continue expansion to SRA and then resources from Genomics/Proteomics/other domains after the engine proves reusable.

This order validates both the educational runtime and the authoring/persistence workflow before multiplying resources.

---

## 27. Immediate development rules

- preserve working auth/project/admin/payment flows,
- use focused branches and PRs,
- do not rewrite Lovable-connected published history,
- do not commit secrets,
- keep Supabase RLS authoritative,
- keep scientific terms beginner-readable but technically correct,
- keep Persian-first RTL UX,
- concept before tool,
- prefer task-based resource teaching over static interface labeling,
- keep one canonical Resource page and cross-link it from relevant domains,
- distinguish external official resources from HubGene educational overlays,
- record source/release/version context when external data portals change,
- keep English portal labels aligned with the actual external interface and place Persian explanation in a separate teaching layer,
- use semantic hotspot keys rather than depending only on step numbers,
- preserve code-backed defaults so a persistence failure does not destroy the teaching experience,
- do not manually edit generated `routeTree.gen.ts` as a routing strategy,
- keep `/admin` operational admin and `/admin/resource-tours` standalone unless a deliberate shared admin layout is designed later,
- never equate paired-end files/technical replicates with biological replicates,
- never use TPM/FPKM as raw-count substitutes for standard DESeq2 teaching,
- never auto-delete a sample from one PCA/QC signal,
- do not overclaim causality from DEG/enrichment results,
- distinguish simulated teaching data from real datasets visibly,
- update this master file after major architecture/product changes.

---

# Current status

**Data Resources is an implemented independent product pillar on `main`, with GDC/TCGA as the first active Resource Learning Engine experience.**

**The GDC visual reference, responsive hotspots, Supabase-managed overrides, image upload, page content editing, and structured Persian hotspot teaching content are now implemented.**

**The GDC editor is intentionally standalone at `/admin/resource-tours`; `src/routes/admin_.resource-tours.tsx` uses TanStack's non-nested file-route convention while the browser URL remains `/admin/resource-tours`.**

**Cloudflare deployment now has a dedicated GitHub Actions workflow that builds the TanStack Start/Nitro output and deploys `.output/server/wrangler.json` with Wrangler 4 when `CLOUDFLARE_API_TOKEN` is configured.**

**Next product-validation step: verify GDC editing/persistence end to end in production, complete the first task-based RNA-seq data-discovery mission, then generalize the proven Resource Tour model toward GEO rather than creating a second one-off editor.**
