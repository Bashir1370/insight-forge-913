# HubGene — Project Master Context

**Updated:** 2026-08-23  
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

### Long-term CMS goal

After the UX is validated, an admin should be able to:

- create/edit a Resource,
- upload/replace screen captures or approved visual assets,
- place hotspots visually,
- write guided steps,
- define tasks/scenarios,
- add quizzes/checkpoints,
- connect the Resource to several scientific learning paths,
- publish revisions without code deployment.

Do not build a new database schema for this until the first GDC learning experience validates the content/UX model.

---

## 4. Data Resources MVP — implementation checkpoint

Feature branch:

```text
feature/data-resources-mvp
```

Base branch:

```text
stabilization/security-ci-2026-08-23
```

Current routes:

```text
/resources
/resources/$slug
```

Primary navigation now exposes:

```text
منابع داده
```

Current implementation files:

```text
src/features/data-resources/resource-catalog.ts
src/features/data-resources/GuidedPortalTour.tsx
src/routes/resources.tsx
src/routes/resources.$slug.tsx
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

### Generic GuidedPortalTour

`GuidedPortalTour.tsx` currently supports:

- interactive hotspots,
- normalized overlay coordinates,
- selectable guided steps,
- why-it-matters text,
- common-mistake callouts,
- next-action guidance,
- progress indicator,
- previous/next controls,
- external link to the official resource,
- a wireframe fallback when no screenshot asset is connected.

The user-provided current GDC homepage screenshot is the intended first real visual reference. The MVP currently keeps the engine independent from a specific binary asset; connecting/versioning the approved screenshot is the next visual-content step.

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

Initial GDC homepage hotspots:

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
/consultation
```

Although the conceptual hierarchy is now:

```text
Transcriptomics → Bulk RNA-seq
```

existing `/learn/rna-seq...` URLs are tied to deep links, progress and application state. Do not migrate URLs merely for naming purity.

Principle:

> Stabilize scientific architecture and learner experience first; migrate URLs later if the benefit justifies the cost.

Important admin route rule:

```text
src/routes/admin.tsx
```

is the intended operational admin route. Do not create a competing route mapping to the same URL.

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

Deploy:

```text
npx wrangler deploy
```

Important lesson:

> Build the TanStack Start application before Wrangler deploy. Skipping the build can lead to missing `@tanstack/react-start/server-entry` output.

`@lovable.dev/vite-tanstack-config` already provides the main TanStack/React/Tailwind integration; do not duplicate those plugins casually.

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

## 18. Admin and Learning CMS

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

The new Data Resources engine is **not yet CMS-backed**. Reuse the proven content/code separation pattern after GDC UX validation rather than prematurely creating a second CMS architecture.

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
```

Known Storage buckets include:

```text
project-files
learning-media
```

Repository migrations at the 2026-08-23 checkpoint:

```text
20260819164500_add_cross_device_learning_progress_state.sql
20260819170818_add_learning_content_cms.sql
20260819173349_optimize_learning_content_cms_policies.sql
```

Recovery gap:

- first migration alters a pre-existing `learning_progress` table,
- CMS policies depend on `private.has_role`,
- multiple production tables predate repository migration history,
- generated Supabase types contain only part of the live schema.

Safe stabilization decision:

- no guessed production migration was added,
- generated `src/integrations/supabase/types.ts` remains untouched,
- `src/integrations/supabase/database.ts` provides temporary compatibility widening.

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
7. Data Resources MVP is currently code-backed; a CMS authoring layer comes after UX validation.
8. Versioned screenshot/resource-page maintenance needs a deliberate content policy because external portals evolve.

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

Known quality state at this checkpoint:

- dependency installation succeeded in the first quality workflow run,
- `lint` failed,
- `typecheck` and `build` were therefore skipped,
- do not claim CI is green until a successful run is observed.

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
12. test auth, dashboard, admin, consultation, Learn, Data Resources, RNA-seq persistence, project files/messages, quotes and invoices.

Do not rely on a ChatGPT conversation as the only project backup.

---

## 26. Current development checkpoint

The newer explicit product decision supersedes the previous “go directly to TCGA-LIHC analysis” checkpoint.

Current order:

1. validate **Data Resources** as an independent reusable pillar,
2. use **GDC / TCGA** as the first Resource Learning Engine implementation,
3. connect the approved/current GDC visual reference and calibrate hotspots,
4. build one complete task-based GDC mission around finding/understanding RNA-seq data,
5. validate UX before adding CMS schema,
6. then connect this upstream data-source learning to the **TCGA-LIHC real RNA-seq analysis with R** experience,
7. after GDC succeeds, expand the same engine to GEO/SRA and then resources from Genomics/Proteomics and other domains.

This order tests whether the reusable learning engine works before multiplying content.

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
- never equate paired-end files/technical replicates with biological replicates,
- never use TPM/FPKM as raw-count substitutes for standard DESeq2 teaching,
- never auto-delete a sample from one PCA/QC signal,
- do not overclaim causality from DEG/enrichment results,
- distinguish simulated teaching data from real datasets visibly,
- update this master file after major architecture/product changes.

---

# Current status

**Repository stabilization exists on PR #20 and still has an unresolved lint quality-gate failure.**

**Data Resources is now the approved independent product pillar and has an MVP implementation on `feature/data-resources-mvp`, with GDC/TCGA as the first active Resource.**

**Next product-validation step: connect the real GDC visual reference, calibrate the guided hotspots, and complete the first task-based GDC workflow before expanding the same engine to more databases/resources or wiring it into CMS.**
