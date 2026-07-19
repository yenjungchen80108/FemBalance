# FemBalance

Predicting anovulation risk from passive wearable and hormone-test signals — an explainable clinical dashboard, not a diagnosis.

**Live demo:** [https://fem-balance.vercel.app](https://fem-balance.vercel.app)

## Problem

Menstrual and hormonal health remains under-researched, and existing tracking tools rely on unreliable self-reporting. Gynecological conditions such as endometriosis are commonly associated with diagnostic delays of 4 to 11 years from symptom onset, driven in part by patient reluctance to seek invasive clinical exams. FemBalance explores whether objective, passively-collected signals — heart rate, skin temperature, and hormone levels — can flag suspected anovulation without relying on self-reported symptoms, and packages that signal for clinicians as a transparent risk indicator, not a diagnostic tool.

## What it does

- **Objective-only signal tracking** — ingests daily heart rate, skin temperature (BBT), LH, and estrogen readings from wearable devices and urine hormone tests. Subjective self-reported symptoms are deliberately excluded from model input to reduce bias.
- **Explainable anovulation prediction** — predicts whether a given day shows a pattern consistent with suspected anovulation, with a confidence score and a per-prediction breakdown of which signals drove the result.
- **Clinician dashboard** — a patient-list view with risk badges, and a per-patient 30-day scrubbable timeline with an explainability panel and a plain-language clinical summary.

## Tech stack

- Next.js 16 (App Router) — frontend + API routes
- MongoDB Atlas — data storage
- Recharts — visualization
- Vercel — deployment
- Python (pandas, scikit-learn, XGBoost, SHAP) — data pipeline and model training

## Data sources

FemBalance merges two datasets, cleaned and unified into a single schema (see [`docs/data-dictionary.md`](docs/data-dictionary.md) for the full column-level reference):

- **mcPHASES** ([PhysioNet](https://doi.org/10.13026/zx6a-2c81), Lin et al., 2025) — real wearable sensor recordings (heart rate, skin temperature) from participants, restricted-access. This data has no outcome labels and is used for display purposes only — it is **not used to train the model**.
- **[Dataset for Menstrual Cycle Phase Prediction and Hygiene Guidance](https://dx.doi.org/10.21227/jf7f-s431)** (Komuntale, Nakirya & Karereigana, 2025, IEEE DataPort) — 42 participants, with cycle-tracking, hormonal (LH, estrogen, BBT), symptom, and hygiene data, including pre-computed cycle-outcome labels. This is the **only data used for supervised model training**.

**Data use compliance:** mcPHASES is distributed under the PhysioNet Restricted Health Data License; per its Data Use Agreement, raw participant-level data is **not redistributed** in this repository — only aggregated, derived features and model outputs are included. Access to the original dataset requires signing PhysioNet's DUA at [physionet.org/content/mcphases](https://physionet.org/content/mcphases/). The IEEE DataPort dataset is cited above per its terms of use.

## Model

- **Input features:** age, skin temperature (BBT), LH, estrogen — all objective instrument readings, no self-reported data
- **Output:** predicted anovulation flag (0/1) + confidence score + per-prediction feature-importance breakdown
- **Primary model — Logistic Regression:** F1 0.818, Accuracy 72.7% (5-fold GroupKFold cross-validation by participant). LH is the dominant signal (coefficient −1.06), consistent with the known physiological role of the LH surge in ovulation.
- **Comparison model — XGBoost:** F1 0.948, Accuracy 92.1% (validated via both 5-fold GroupKFold and Leave-One-Subject-Out cross-validation). Skin temperature is the dominant signal — a different ranking than Logistic Regression, which we report transparently rather than hide, since it warrants further validation before clinical trust is established.
- **Why Logistic Regression is primary, not XGBoost:** its explanation aligns with established medical knowledge and every prediction is directly traceable to a coefficient, without requiring post-hoc tooling. This reflects the challenge brief's priority on reproducibility and explainability over raw accuracy.

### Reproducing predictions

The trained model's output is exported as JSON and seeded into MongoDB
separately from the raw data pipeline:

```bash
# 1. Train and export predictions (Python)
cd data-pipeline
python3 train_and_export.py
# → outputs predictions_export.json

# 2. Copy into the Next.js project
cp predictions_export.json ../fembalance/data/

# 3. Seed into MongoDB
cd ../fembalance
npx tsx scripts/seed-predictions.ts
```

Model training code lives in `data-pipeline/train_and_export.py`. See
[`docs/data-dictionary.md`](docs/data-dictionary.md) for the full input
schema this script expects.

## Known limitations

- **Training labels are 100% synthetic.** The only rows with a usable target label come from the IEEE DataPort dataset, which is a synthetically augmented compilation, not raw clinical observation. Real-world wearable data (mcPHASES) has no ground truth and is not used in training.
- **Small sample size.** Only 42 participants contribute to model training (2,937 daily records). Cross-validation is grouped by participant to avoid data leakage, but results should be interpreted as directional, not conclusive.
- **Cross-sectional, not temporal.** Predictions are based on same-day readings rather than a rolling window. Incorporating multi-day trend features (e.g. temperature trajectory) is a natural next step, given the continuous physiological nature of ovulatory cycles.
- **Temperature scale mismatch across sources.** Skin temperature means different things in each dataset (relative deviation vs. absolute BBT) and is not visually compared across sources on the same axis.

## Roadmap

- Validate the model against a larger, real-world labeled cohort
- Extend from a clinician-only tool to a two-sided platform: patients log in directly and receive an alert when their own data suggests a risk pattern
- Incorporate rolling-window trend features for temporal pattern detection

## Local setup

1. Install dependencies

```bash
npm install
```

2. Add `MONGODB_URI` to `.env.local`

```bash
MONGODB_URI=your_mongodb_uri
```

3. Seed the database

```bash
npx tsx scripts/seed-real.ts
npx tsx scripts/seed-predictions.ts
```

4. Start the development server

```bash
npm run dev
```

## Data dictionary

Full column-level schema documentation, including cleaning steps and data-quality notes, is in [`docs/data-dictionary.md`](docs/data-dictionary.md).

## Team

Built for Hack-Nation — Foundation Models for Women's Hormonal Health. Team ALWAYS ONLINE.
