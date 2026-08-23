# HubGene — Project Master Context

**Updated:** 2026-08-23  
**Repository:** `Bashir1370/insight-forge-913`  
**Primary branch:** `main`  
**Purpose:** the single Markdown source for HubGene product decisions, scientific learning standards, architecture, recovery notes, stabilization status, and the next development direction.

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

HubGene should help a researcher understand the scientific problem, evidence, limitations, and analysis structure before presenting software as the solution.

Primary early persona:

- life-science MSc-level learner/researcher,
- little or no programming experience,
- wants enough understanding to make correct research decisions,
- does not need to become a programmer before understanding bioinformatics.

Educational default:

> **Concept → Purpose → Input → Output → Checks → Mistakes → Tools**

---

## 2. Approved scientific information architecture

The approved top-level Learn architecture separates **scientific domains**, **measurement modalities**, and **analysis paths**.

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
- **Microbiome is a research domain**, not simply another item at the same level as the five Omics pillars. It can include 16S, shotgun metagenomics, metatranscriptomics, and related modalities.

Long-term mental model:

```text
Omics
├── Transcriptomics
│   ├── Foundations
│   ├── Bulk RNA-seq
│   ├── Single-cell RNA-seq
│   ├── Spatial Transcriptomics
│   ├── Long-read Transcriptomics
│   └── Advanced Topics
├── Genomics
├── Epigenomics
├── Proteomics
└── Metabolomics

Cross-cutting
├── Experimental Design
├── Statistics
├── Public Data Research
├── Functional Analysis
├── Network Biology
├── Biomarker Discovery
├── Visualization
└── Biological Interpretation
```

---

## 3. Transcriptomics blueprint

Transcriptomics is the first major educational pillar of HubGene.

Its internal architecture has five layers:

```text
Transcriptomics
├── A. Foundations
├── B. Measurement Modalities
├── C. Analysis Paths
├── D. Interactive Labs
└── E. Project Application
```

### Foundations

The approved foundation sequence is:

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

### Modality selection starts from the question

Conceptually:

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

## 4. Bulk RNA-seq conceptual path vs current implementation

The approved conceptual Bulk RNA-seq backbone is a 12-stage scientific path:

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

The current repository has evolved this into a newer guided learning implementation with Foundation content plus an 11-lesson specialist path:

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

These are not a contradiction: the 12-stage list is the **scientific mental map**, while the current 11-lesson implementation groups/splits concepts differently for teaching.

Lessons 1–10 share `GuidedConceptLesson`; lesson 11 has integrated-project-specific CMS support.

Do not force route/file naming to match the conceptual blueprint until a deliberate content migration is planned.

---

## 5. Interaction-first learning standard

HubGene should be **interaction-first**, not text-first.

Every major learning unit should trend toward:

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

Persian learner-facing shorthand:

1. بفهم
2. عمیق‌تر شو
3. ببین
4. امتحان کن
5. تصمیم بگیر
6. اشتباه را پیدا کن
7. در یک Case Study ببین
8. به پروژه خودت وصل کن
9. ایستگاه تسلط

Guideline:

> Aim for at least one meaningful interaction every 2–3 minutes of study where it improves learning.

Interaction is not synonymous with quiz. Reusable patterns include:

- Decision Lab
- Data Inspector
- Compare Lab
- Build Lab
- Detect the Problem
- Interpretation Lab
- What Happens If...?

Whenever useful, let the learner make a wrong decision and see its consequence rather than only displaying “wrong”.

Mini Labs are a formal product layer: **HubGene Interactive Labs**.

---

## 6. Shared concepts

Concepts such as these should eventually be reusable across Omics:

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
```

Principle:

> Build the core concept once, then show context-specific examples for each Omics domain.

---

## 7. Learning language and writing standard

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

Do not treat scientific names, file formats, software names, or common abbreviations as translation targets when translation creates ambiguity.

---

## 8. Locked scientific teaching rules for RNA-seq

The following principles were explicitly scientifically reviewed and should be preserved.

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
- gene-ID mapping, species, database/source version and unmapped genes are part of reproducibility.
- overlapping gene sets can create redundant significant results.
- multiple testing/FDR also applies at gene-set level.
- in bulk RNA-seq, immune/stromal enrichment may reflect cell-composition change, within-cell expression change, or both.
- biological interpretation should be phrased as a hypothesis consistent with the evidence unless independent evidence supports causality.

### Integrated pancreatic-cancer lesson

Lesson 11 is a **simulated educational scenario**, not real patient data and not a published study result.

Rules preserved in that scenario:

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

## 9. Route strategy

Important current routes include:

```text
/learn
/learn/rna-seq
/learn/rna-seq/navigator
/learn/rna-seq/project
/dashboard
/admin
/admin/content
/consultation
```

Although the conceptual hierarchy is now:

```text
Transcriptomics → Bulk RNA-seq
```

existing `/learn/rna-seq...` URLs are already tied to deep links, progress and application state. Do not migrate URLs merely for naming purity.

Principle:

> Stabilize scientific architecture and learner experience first; migrate URLs later if the benefit justifies the cost.

Important admin route rule:

```text
src/routes/admin.tsx
```

is the intended operational admin route. Do not create a competing route that maps to the same URL.

---

## 10. Current technology stack

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

`typecheck` runs:

```text
tsc --noEmit
```

TypeScript strict mode is enabled.

---

## 11. Lovable / Git history safety

This repository is connected to Lovable.

**Do not rewrite published Git history.**

Avoid force pushing or rewriting already-pushed shared history through rebase/amend/squash workflows that replace commits.

Commits pushed to connected branches may sync back to Lovable, so keep shared branches in a working state.

Preferred workflow:

1. branch from `main`,
2. focused commits,
3. pull request,
4. quality checks,
5. merge without rewriting published history.

---

## 12. Deployment

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

## 13. Environment and repository security

Expected variable names include:

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

## 14. Existing production-oriented workflows

HubGene already contains real product workflows beyond Learn:

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

Preserve these during Learn refactors.

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

## 15. Admin and CMS

### Operational admin

```text
src/routes/admin.tsx
```

Manages projects, profiles, messages, project files, consultations, quotes and invoices. Access requires authenticated admin role.

### Learning content admin

```text
src/routes/admin_.content.tsx
```

Rendered URL:

```text
/admin/content
```

Learning CMS supports:

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

---

## 16. Learning CMS data model

Repository migrations currently create:

```text
learning_content_drafts
learning_content_published
learning_content_revisions
```

Storage bucket:

```text
learning-media
```

The current migration allows common image/video formats and sets a 100 MB file limit.

CMS RLS depends on:

```text
private.has_role('admin'::text)
```

The definition of `private.has_role` is not currently present in repository migration history.

---

## 17. Learning progress persistence

Current guided lessons use dual persistence:

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

Current progress payload version:

```text
version: 2
```

It stores current position, unlocked range, answer indexes and timestamps. Local and cloud timestamps are compared; newer state wins. Reset clears local and account-backed state.

### Required future fix

Answers are currently persisted by numeric section and option indexes. CMS can reorder sections/options.

Future publishing should bind progress to a published content revision/hash/version and define an explicit reset/migration policy for structural content changes.

---

## 18. Known database tables and storage

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

The historical standard browser project-file upload UI is around 6 MB; this is not a final architecture for large scientific raw data such as FASTQ.

---

## 19. Supabase migration/type status

At the 2026-08-23 stabilization checkpoint, repository migrations are:

```text
20260819164500_add_cross_device_learning_progress_state.sql
20260819170818_add_learning_content_cms.sql
20260819173349_optimize_learning_content_cms_policies.sql
```

Important recovery gap:

- the first migration alters a pre-existing `learning_progress` table,
- CMS policies depend on `private.has_role`,
- multiple production tables predate repository migration history,
- generated Supabase types currently contain only `profiles` and `projects`.

Therefore this repository is not yet a complete database disaster-recovery source.

### Safe stabilization decision

No guessed production migration was added.

Instead:

- generated `src/integrations/supabase/types.ts` remains untouched,
- `src/integrations/supabase/database.ts` was added as a temporary compatibility layer,
- Supabase client imports the compatibility `Database` type,
- known generated types remain useful while unrepresented legacy tables/RPCs can compile.

### Required future database stabilization

When direct live-schema access/export is available:

1. export the complete Supabase schema,
2. keep a canonical schema backup,
3. reconcile old objects with migrations,
4. regenerate `src/integrations/supabase/types.ts`,
5. remove compatibility widening in `database.ts`,
6. verify all RLS and `private.has_role`,
7. test a clean replay in a disposable environment.

Do not invent security-sensitive schema merely to make migration history look complete.

---

## 20. Browser R / WebR proof of concept

Current repo includes:

```text
src/features/transcriptomics-learning/rna-seq/BrowserRnaSeqPoc.tsx
```

It loads WebR in the browser and uses **synthetic technical demonstration data**, not TCGA.

The PoC explores tasks such as inspection, library-size calculations, log transformation, PCA, reproducibility and a DESeq2-related environment test.

Treat it as a technical experiment, not as the scientific case-study product itself.

---

## 21. Real RNA-seq case-study direction

The next high-value development direction is a scientifically curated real-study learning experience using fixed/precomputed snapshots rather than attempting heavy remote bioinformatics live in the browser.

Preferred first reusable **Golden Template**:

```text
TCGA-LIHC
```

Target flow:

```text
Research Question
→ Dataset
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

---

## 22. CMS / maintainability debt

Known non-blocking issues:

1. CMS publish is not transactional; revision insert, published upsert and draft cleanup are separate client operations.
2. Removing media from lesson content can leave orphaned Storage files.
3. Stable CMS hook duplicates a published-content fetch.
4. Progress is not bound to content revision.
5. Generated Supabase database types are stale; compatibility widening is temporary.
6. Several route/components are very large (admin, dashboard, Navigator, Project Mode).

Refactor when a development milestone benefits from it, not merely because files are long.

Good decomposition boundaries:

- data-access/services,
- domain types,
- page sections,
- forms/editors,
- reusable operational components,
- learning runtime vs scientific content.

The shared `GuidedConceptLesson` approach is a good pattern to preserve.

---

## 23. Quality gates added in stabilization

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

Configured for `main`, stabilization branches and pull requests.

Do not assume CI is green until GitHub reports an actual successful run.

---

## 24. Stabilization pass — 2026-08-23

Branch:

```text
stabilization/security-ci-2026-08-23
```

Pull request:

```text
#20 — Stabilization: secure env handling and add quality gates
```

Changes:

- repository confirmed private while GitHub integration remains connected,
- `.env` removed from branch,
- environment files ignored,
- safe `.env.example` added,
- `typecheck` script added,
- GitHub Actions quality workflow added,
- Supabase compatibility database type added without editing generated types,
- no guessed/destructive database migration added,
- historical product/technical/blueprint/scientific-review Markdown files consolidated into this master file,
- all other repository-level Markdown documentation removed.

---

## 25. Documentation policy

`HUBGENE_PROJECT_MASTER.md` is the only general project Markdown document intended to remain.

For future milestones, update this file instead of creating dated backup/review Markdown files.

It should preserve:

- current product decisions,
- scientific learning rules,
- architecture constraints,
- deployment/recovery knowledge,
- technical debt,
- current milestone and next direction.

Do not copy secrets or obsolete large code snapshots into documentation.

---

## 26. Recovery checklist

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
12. test auth, dashboard, admin, consultation, Learn, RNA-seq persistence, project files/messages, quotes and invoices.

Do not rely on a ChatGPT conversation as the only project backup.

---

## 27. Next development checkpoint

Cleanup is not the product goal. After the stabilization PR is reviewed/merged, return to development.

The foundations and guided RNA-seq learning system are already substantially implemented, so the next high-value milestone should be the detailed **real RNA-seq case-study experience**.

Recommended next implementation target:

> **TCGA-LIHC as the first real-data Golden Template**

Before coding the full experience, define each learner screen:

- what the learner sees,
- what question/decision is required,
- what chart/table is shown,
- what R code is revealed,
- what must be understood before unlock,
- which artifacts are fixed snapshots,
- how provenance is communicated,
- how the complete reproducible R script is delivered.

Then reuse the architecture for BRCA/LUAD and future Omics projects.

---

## 28. Immediate development rules

- preserve working auth/project/admin/payment flows,
- use focused branches and PRs,
- do not rewrite Lovable-connected published history,
- do not commit secrets,
- keep Supabase RLS authoritative,
- keep scientific terms beginner-readable but technically correct,
- keep Persian-first RTL UX,
- concept before tool,
- never equate paired-end files/technical replicates with biological replicates,
- never use TPM/FPKM as raw-count substitutes for standard DESeq2 teaching,
- never auto-delete a sample from one PCA/QC signal,
- do not overclaim causality from DEG/enrichment results,
- distinguish simulated teaching data from real datasets visibly,
- update this master file after major architecture/product changes.

---

# Current status

**Repository documentation cleanup and the first stabilization pass are complete on the stabilization branch.**

**Next phase: continue HubGene product development, with Transcriptomics as the first Omics pillar and a real RNA-seq case-study/TCGA-LIHC experience as the recommended next major milestone unless a newer explicit decision supersedes it.**
