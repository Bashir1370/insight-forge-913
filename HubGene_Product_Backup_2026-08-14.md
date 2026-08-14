# HubGene — Product & Research Navigator Backup
**Backup date:** 2026-08-14  
**Scope:** Product strategy, user needs, educational architecture, and the five initial research lines.

---

# 1) Product identity

HubGene is being designed as a **Persian-first bioinformatics education, research-navigation, consultation, and later analysis ecosystem**.

The early product should not be framed as:

> "Upload your FASTQ and we analyze it."

Preferred positioning:

> Help researchers understand what they need, design the right path, consult an expert when needed, and only then move toward execution.

Possible positioning directions considered:
- Persian Bioinformatics Research Navigator
- Online Bioinformatics Core for Researchers
- From research question to analysis plan

No final brand-positioning sentence has been locked yet.

---

# 2) Product flywheel

**Discover**
→ Learn
→ Navigate
→ Review
→ Consult
→ Plan
→ Analyze
→ Interpret
→ Learn again

The aim is long-term relationship rather than one-off service purchase.

A student can first arrive through a beginner guide, later become a consultation client, and eventually become a researcher or PI who uses HubGene for larger projects.

---

# 3) Why education comes first

Education is not only a standalone product.

It is also:
- trust building,
- SEO acquisition,
- lead generation,
- demand discovery,
- qualification,
- preparation for consultation,
- reduction of misunderstanding before analysis.

Do not rush to produce large 20–30 hour paid courses.

Use Navigator + Blog + Consultation behavior to learn which topics users actually need, then produce paid education around proven demand.

---

# 4) Proposed paid-learning model

Prefer initially:
- Mini-courses
- Project-based modules
- Practical workshops
- Cohorts
- Narrow applied courses

Possible later first major course if demand validates it:
> RNA-seq و WGCNA برای پژوهشگران علوم زیستی

Course naming should feel approachable for life-science researchers, not like a computer-science bootcamp.

Example preferred framing:
> از نمونه تا نتیجه: درک عملی RNA-seq برای پژوهشگران علوم زیستی

---

# 5) Consultation architecture

Consultation is likely to be a stronger early revenue source than video courses.

Free support should be bounded.

## Free / low-friction support
- Initial triage
- Fit check
- Missing-information summary
- High-level next-step guidance

Do not give away a complete customized study design for free.

## Paid consultation examples
- Bioinformatics Orientation Session
- Ask-a-Bioinformatician
- Study Design Consultation
- Data / Metadata Readiness Review
- Analysis Plan / Study Plan
- Results Interpretation Consultation
- Troubleshooting Consultation
- Thesis / reviewer-response oriented consultation

---

# 6) Flagship consultation deliverable — Bioinformatics Study Plan

A possible paid artifact should contain:

- Research question
- Recommended data
- Minimum sample / metadata needs
- Workflow diagram
- Preprocessing / QC
- Statistical design
- Contrasts
- Covariates
- Tool recommendations
- Expected outputs / figures
- Validation
- Compute / data considerations
- Risks
- Limitations
- Recommended next actions

This can be valuable even if the customer never purchases full analysis.

---

# 7) Five initial research lines

## Line 1 — Bulk Transcriptomics
Core topics:
- RNA-seq
- QC
- Quantification
- Count matrix
- Normalization
- PCA / sample exploration
- Differential expression
- Visualization
- Functional analysis
- Interpretation

## Line 2 — Public Data Research
Core platforms/topics:
- GEO
- SRA
- TCGA
- Public dataset search
- Dataset selection
- Metadata quality
- Cohort structure
- Reproducible reuse
- Validation using independent datasets
- Building a research project without private raw data

Strategic importance:
- Excellent beginner entry point
- No private-data trust barrier
- Can produce public demos
- Strong fit for student research projects

## Line 3 — Network Biology & Biomarker Discovery
Core topics:
- WGCNA
- PPI
- Hub genes
- Network interpretation
- Biomarker discovery
- Integration with DEG
- Validation strategy
- Avoiding "hub gene = biomarker" oversimplification

## Line 4 — Single-cell Transcriptomics
Core topics:
- scRNA-seq vs bulk
- Cell-level QC
- Filtering
- Normalization
- Dimensionality reduction
- Clustering
- Cell annotation
- Differential expression
- Trajectory
- Cell-cell communication
- Interpretation

## Line 5 — Microbiome
Core topics:
- 16S
- Sequencing concept
- ASV / OTU concepts
- Taxonomy
- Alpha diversity
- Beta diversity
- Differential abundance
- Confounders
- Biological interpretation

## Cross-cutting layer
- GO
- KEGG
- GSEA
- Pathway analysis
- Enrichment
- Biological interpretation
- Visualization
- Reproducibility
- Experimental design

---

# 8) Persona 01 across the five lines

Same persona, different entry questions.

### Bulk Transcriptomics
> RNA-seq چیست و تحلیل آن چه مراحلی دارد؟

### Public Data Research
> آیا می‌توان از GEO/TCGA/SRA یک پروژه پژوهشی واقعی ساخت؟

### Network Biology
> WGCNA، شبکه ژنی و Hub Gene یعنی چه؟

### Single-cell
> Single-cell RNA-seq چه تفاوتی با RNA-seq معمولی دارد؟

### Microbiome
> تحلیل 16S دقیقاً چه چیزی درباره جامعه میکروبی به ما می‌گوید؟

Key design decision:
**One learning architecture; five scientific contents.**

---

# 9) Shared Research Line Framework

Every research line should ultimately have:

1. Start Here
2. Learning Navigator
3. Workflow Map
4. Data Explorer
5. Demo Project
6. Blog / Guides
7. Learning Path
8. Project Mode
9. Problem Solver
10. Expert Consultation

---

# 10) Persona 01 detailed profile

## Description
Life-science MSc-level learner/researcher; no programming background; interested in understanding bioinformatics analysis in simple language.

## Does not necessarily want
- Full software engineering skills
- Deep algorithm derivations
- Advanced mathematics at first contact

## Wants
- Conceptual clarity
- Workflow structure
- Relationship between biological question and analysis
- Understanding of inputs/outputs
- Enough literacy to participate in a real project

## Key pain points
- Tool overload
- Statistical vocabulary
- Missing mental map
- Anxiety around programming
- Not knowing where their current file fits
- Confusion between "analysis method" and "software tool"

---

# 11) Core educational doctrine

### Analysis starts with a question
Do not start with software.

### Concept before tool
Teach:
**What → Why → Input → Output → Checks → Mistakes → Tools**

### Programming is an implementation layer
Not the first gateway to understanding.

### Teach with a continuous biological story
A single example should be carried through the workflow.

### Always preserve the "You are here" mental map
The user should never wonder:
> "Where am I in the analysis?"

---

# 12) RNA-seq Navigator — four modes

## Learning Mode
For understanding from zero.

## Project Design Mode
For applying concepts to a real study.

## Data Mode
For users who already have:
- FASTQ
- BAM
- Count matrix
- normalized data
- Excel / CSV
- unknown file type

## Problem Solver Mode
For real issues such as:
- poor QC
- strange PCA
- outliers
- batch effect
- no DEGs
- too many DEGs
- confusing heatmap
- weak GSEA
- uncertainty about normalization

---

# 13) RNA-seq Learning Mode — detailed nodes

## Node 0 — What can RNA-seq tell us?
Outcome:
- RNA-seq is understood as a way to study RNA / gene-expression patterns in a biological question.

## Node 1 — Research Question
Outcome:
- Biological question is separated conceptually from statistical comparison.

## Node 2 — Experimental Design
Concepts:
- Groups
- Control
- Replicate
- Batch
- Confounding
- Sample planning

Key learning message:
> Problems in study design cannot always be fixed later with software.

## Node 3 — Sample → Sequencing → FASTQ
Outcome:
- Understand how a biological sample becomes computational data.

## Node 4 — Data Explorer
Possible interactive file cards:
- sample_01.fastq.gz
- sample_01.bam
- counts.csv
- TPM_matrix.xlsx

Goal:
- Learn where each file belongs in the workflow.

## Node 5 — Quality Control
Concepts:
- Base quality
- Adapter content
- GC content
- Duplication
- Reports

Important nuance:
> A warning in FastQC does not automatically mean the data are unusable.

## Node 6 — Quantification
Goal:
- Understand how reads eventually become gene-level abundance/count information.

Tools may be named only after concept:
- STAR
- HISAT2
- Salmon
- Kallisto
- featureCounts

## Node 7 — Expression Matrix & Normalization
Goal:
- Understand gene × sample matrix
- Understand why raw counts cannot always be directly compared

## Node 8 — Sample Exploration
Concepts:
- PCA
- Correlation
- Clustering
- Outlier
- Batch effect

Important message:
> PCA helps reveal structure; it does not by itself prove a biological conclusion.

## Node 9 — Differential Expression
Concepts:
- log2 fold change
- p-value
- adjusted p-value / FDR

Important message:
> A large fold change alone is not enough.

## Node 10 — Visualization
Concepts:
- Volcano plot
- Heatmap
- Pattern recognition

Important message:
> A beautiful plot is not the same as a valid result.

## Node 11 — Functional Analysis
Goal:
- Move from a gene list to biological processes/pathways

Concepts:
- GO
- Pathways
- GSEA

## Node 12 — Biological Interpretation
Goal:
- Avoid overclaiming
- Connect results back to the biological question
- Preserve limitations

## Node 13 — Where next?
Possible routes:
- Network biology / WGCNA
- Functional analysis / GSEA
- Public datasets
- Biomarker discovery
- Project Mode

---

# 14) Interaction patterns

Use:
- single-question choices,
- micro explanations,
- small examples,
- "بیشتر توضیح بده",
- "برای پروژه من چطور؟",
- confidence checks,
- short knowledge checks,
- workflow position indicator.

Avoid:
- long up-front forms,
- heavy equations,
- tool dumps,
- long code blocks,
- premature paid CTAs.

---

# 15) HubGene Guidance Engine

The system should progressively infer:

- Knowledge level
- Intent
- Project stage
- Data stage
- Need for expert review

## Adaptive explanation
Same scientific node; different detail level.

## Progressive profiling
Ask only when the information is relevant.

## Behavioral signals
Examples:
- repeated "more explanation" clicks
- revisiting a topic
- confidence choice
- incorrect knowledge checks
- entering project-specific branches

## No fake precision
Avoid:
> Your RNA-seq score is 73.4%.

Prefer:
- Strong
- Developing
- Review Recommended

---

# 16) Recommendation engine examples

### User A
Beginner, no project, weak statistics confidence.
Recommendation:
- Free beginner guides

### User B
Beginner but wants to execute analysis personally.
Recommendation:
- Practical course

### User C
Has an actual project before sequencing.
Recommendation:
- Project Design Mode / study design review

### User D
Has FASTQ and unexpected PCA/batch issues.
Recommendation:
- Problem Solver / expert consultation

---

# 17) Consultation triggers

Recommend expert review when there is a concrete reason such as:

- Very small sample size
- Complex study design
- Confounding risk
- Strong batch effect
- Multi-factor contrasts
- Time-series complexity
- WGCNA with questionable sample support
- Biomarker claims
- Contradictory project answers
- Unexpected results
- Metadata uncertainty

The consultation CTA should appear as a **scientific recommendation**, not generic sales pressure.

---

# 18) Blog architecture

Blog is not a random content archive.

Each article should connect to a Navigator node.

Example:

Navigator node:
**PCA**

→ Beginner article:
"PCA در RNA-seq چیست؟"

→ Deeper guide:
"چطور PCA را تفسیر کنیم؟"

→ Short video:
"۵ دقیقه با PCA"

→ Paid course:
"PCA عملی با R"

Content depth:
1. Beginner
2. Intermediate
3. Practical
4. Advanced / troubleshooting

---

# 19) Data Explorer concept

Potential signature feature.

User selects or identifies:
- FASTQ
- BAM
- Counts
- TPM / FPKM
- Expression Matrix
- Excel
- "I don't know"

HubGene responds by showing:
- where the user currently is in the workflow,
- what likely happened before,
- what possible next steps are,
- what they should verify.

---

# 20) Educational dashboard concept for later

Potential logged-in progress view:

### Your RNA-seq Map

Conceptual Understanding — Strong  
Experimental Design — Developing  
Data Understanding — Strong  
Statistics — Review Recommended  
Biological Interpretation — Developing

Avoid gamification for its own sake.

The goal is orientation and recommendation.

---

# 21) Product sequence still planned

1. Finish Public Data Research for Persona 01
2. Finish Network Biology & Biomarker Discovery for Persona 01
3. Finish Single-cell for Persona 01
4. Finish Microbiome for Persona 01
5. Unify product architecture
6. Define HubGene Learn home
7. Define user progress / content graph / CTA logic
8. Return to coding
9. Implement RNA-seq as the first complete working Navigator
10. Reuse framework for the remaining four research lines

---

# Current next step

**Persona 01 × Public Data Research**

Questions to answer:
- What triggers this user to search for GEO/SRA/TCGA?
- What do they misunderstand about public datasets?
- What is the correct beginner mental model?
- What does the learning workflow look like?
- How does a dataset become a valid research project?
- How should HubGene teach dataset selection and metadata?
- What should remain free?
- What is a paid learning product?
- When is consultation justified?
- What should the Public Data Navigator output?

---

# End of product backup
