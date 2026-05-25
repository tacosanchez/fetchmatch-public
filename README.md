# FetchMatch

FetchMatch is an AI-assisted rescue dog matching prototype. It turns inconsistent adoption-listing prose into structured dog profiles, then compares those profiles against an adopter questionnaire using compatibility scoring, safety filters, distance checks, and explainable match reasoning.

## What it does

- Represents each dog as a typed profile with behaviour, household, training, reactivity, size, location, and living-requirement fields.
- Scores each dog against adopter preferences such as activity level, household composition, alone-time tolerance, experience, size, age, housing, and postcode radius.
- Applies hard safety filters before ranking.
- Shows match percentages, compatibility flags, summaries, and listing links.
- Separates subjective matching logic from the UI so each recommendation can be inspected and adjusted.

## Why it exists

Rescue listings are written for humans, but adopters often need structured decision support: which dogs fit their household, which needs are hard constraints, and which tradeoffs require careful review. FetchMatch demonstrates how LLM-style classification can turn messy prose into explainable matching logic while keeping final adoption decisions with people and rescue organisations.

## Built with

- Next.js
- React
- TypeScript
- Tailwind CSS
- Typed dog/adopter schemas
- Rule-based matching and safety filters
- LLM classification prompt design

## Public repo note

This is a public-safe portfolio copy. The private working prototype used live rescue listing data and generated local image/data artifacts; those artifacts and scrape outputs are intentionally omitted here. The app runs on a small synthetic fixture dataset in `lib/dogs.ts` so the matching workflow can be reviewed without redistributing third-party listing text or images.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```
