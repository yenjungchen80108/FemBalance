# FemBalance

Predicting hormonal phases from everyday wearable data — built for equitable women's health.

**Live demo:** [https://fem-balance.vercel.app](https://fem-balance.vercel.app)

## Problem

Menstrual and hormonal health remains under-researched, and existing datasets are small and demographically narrow (e.g. mcPHASES covers 42 young adults in Toronto). Underserved women — with limited access to healthcare, nutrition, and wearable technology — are especially absent from this data, making it harder to build tools that serve them. FemBalance explores whether passive wearable signals (heart rate, skin temperature) can predict hormonal phase without requiring manual tracking, and packages that prediction for clinicians rather than end consumers.

## What it does

- **Wearable signal tracking** — ingests daily-aggregated heart rate, skin temperature, sleep, and glucose data
- **Explainable phase prediction** — predicts menstrual cycle phase (menstruation / late-follicular / ovulation / luteal) with a confidence score and feature-importance breakdown, prioritizing interpretability over model size
- **Clinician dashboard** — a patient-list view with flagged anomalies, and a per-patient timeline with an explainability panel

## Tech stack

- Next.js 16 (App Router) — frontend + API routes
- MongoDB Atlas — data storage
- Recharts — visualization
- Vercel — deployment

## Data source

Built on [mcPHASES](https://doi.org/10.13026/zx6a-2c81) (Lin et al., 2025), a PhysioNet restricted-access dataset combining Fitbit, Dexcom CGM, and Mira hormone-tracker data from 42 participants.

**Data use compliance:** mcPHASES is distributed under the PhysioNet Restricted Health Data License. Per the Data Use Agreement, raw participant-level data is **not redistributed** in this repository. Only aggregated, derived features and trained model outputs are included. Access to the original dataset requires signing PhysioNet's DUA at [https://physionet.org/content/mcphases/](https://physionet.org/content/mcphases/).

## Data Availability

Raw participant-level data (mcPHASES) is not redistributed in this repository,
in compliance with the PhysioNet Restricted Health Data Use Agreement.
Only derived, aggregated features and model outputs are included under `/data`.
To reproduce the full pipeline, request access to mcPHASES at
https://physionet.org/content/mcphases/ and run `scripts/clean_and_join.py`.

## Model

- Input features: daily-aggregated heart rate, skin temperature, sleep score, glucose average
- Output: predicted cycle phase + confidence score + top contributing features
- Design priority: reproducibility and explainability over raw accuracy, per the challenge brief

_(Model performance metrics to be added once trained on the full dataset — see `/model` for training code and evaluation.)_

## Equity framing

Patients in this demo are tagged by cohort (`underserved` / `general`) to reflect the project's goal: extending hormone-phase prediction to populations underrepresented in existing wearable-health datasets.

## Local setup

1. Install dependencies

```bash
npm install
```

1. Add MONGODB_URI to .env.local

```bash
MONGODB_URI=your_mongodb_uri
```

1. Seed the database

```bash
npx tsx scripts/seed-mock.ts # or seed-real.ts once available
```

1. Start the development server

```bash
npm run dev
```

## Team

Built for Hack-Nation — Foundation Models for Women's Hormonal Health.
