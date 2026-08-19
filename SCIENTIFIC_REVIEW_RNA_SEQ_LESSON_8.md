# Scientific review — RNA-seq lesson 8

Lesson 8 introduces sample-level quality assessment after the count matrix is constructed.

Primary scientific checks used while drafting the lesson:

- Bioconductor RNA-seq workflows use variance-stabilized or regularized-log transformed count data for sample-to-sample distances, clustering and PCA-style exploratory visualization rather than treating raw counts as an ideal Euclidean visualization scale.
- PCA is presented as a low-dimensional summary of variation across samples; PC1 and PC2 explain only part of the total variance unless their percentages sum to 100%.
- Sample-to-sample distance and clustering are exploratory summaries and should be interpreted together with experimental metadata.
- A sample appearing distant in PCA or clustering is treated as a trigger for investigation, not an automatic exclusion rule. Independent evidence from raw-data QC, mapping/quantification, metadata and laboratory records is required for a defensible exclusion decision.
- VST/rlog are taught as transformations for exploratory visualization and quality assessment, not as replacements for the count-based statistical model used for differential expression.
- Batch-associated structure is linked back to study design: if a biological condition is completely confounded with a technical batch, downstream software cannot uniquely separate the two causes from the observed data alone.

This file records the scientific intent behind the lesson; the learner-facing text remains beginner-first and Persian-first.
