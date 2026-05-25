import { DogProfile, QuizAnswers, MatchResult } from "./types";
import { getPostcodeCoords, distanceKm } from "./geo";

function ageCategory(years: number): "puppy" | "young" | "adult" | "senior" {
  if (years < 1) return "puppy";
  if (years < 3) return "young";
  if (years < 8) return "adult";
  return "senior";
}

function minKidAgeFromHousehold(household: QuizAnswers["household"]): number {
  if (household.kidAges === "under_5") return 0;
  if (household.kidAges === "5_to_12") return 5;
  if (household.kidAges === "teens") return 12;
  return 99;
}

export function matchDogs(dogs: DogProfile[], answers: QuizAnswers): MatchResult[] {
  const results: MatchResult[] = [];
  const userCoords = getPostcodeCoords(answers.location.postcode);
  const youngestKid = minKidAgeFromHousehold(answers.household);

  for (const dog of dogs) {
    const c = dog.classification;
    const flags: string[] = [];

    // ── Hard filters ──
    if (answers.household.kidAges !== "none" && c.household.minKidAge !== null && youngestKid < c.household.minKidAge) continue;
    if (answers.household.hasCats && c.household.catCompatibility === "no") continue;
    if (answers.household.hasOtherDogs && c.household.dogCompatibility === "no") continue;
    if (answers.experience === "first_timer" && c.reactivity.overallLevel === "needs_support") continue;
    if (answers.experience === "first_timer" && c.reactivity.overallLevel === "manageable") continue;

    // ── Distance ──
    let dist: number | null = null;
    if (userCoords) {
      dist = distanceKm(userCoords.lat, userCoords.lng, dog.lat, dog.lng);
      if (answers.location.radiusKm > 0 && dist > answers.location.radiusKm) continue;
    }

    // ── Energy score (0-20) ──
    const energyMap = { couch: "low", moderate: "moderate", active: "high", very_active: "very_high" } as const;
    const userEnergy = energyMap[answers.activityLevel];
    const energyLevels = ["low", "moderate", "high", "very_high"];
    const energyDist = Math.abs(energyLevels.indexOf(userEnergy) - energyLevels.indexOf(c.energy.physical));
    const energyScore = energyDist === 0 ? 20 : energyDist === 1 ? 12 : energyDist === 2 ? 4 : 0;

    // ── Attachment score (0-15) ──
    let attachmentScore = 8;
    const aloneMap = { rarely: "needs_company", few_hours: "some_time", full_day: "independent" } as const;
    const userAlone = aloneMap[answers.aloneTime];
    if (userAlone === "independent" && c.attachment.aloneTimeTolerance === "needs_company") {
      attachmentScore = 0;
      flags.push("Prefers company most of the time");
    } else if (userAlone === c.attachment.aloneTimeTolerance) {
      attachmentScore = 15;
    } else if (
      (userAlone === "independent" && c.attachment.aloneTimeTolerance === "some_time") ||
      (userAlone === "some_time" && c.attachment.aloneTimeTolerance === "independent")
    ) {
      attachmentScore = 12;
    }
    if (c.attachment.separationAnxiety && answers.aloneTime !== "rarely") {
      attachmentScore = Math.max(0, attachmentScore - 5);
      flags.push("Needs help with alone time");
    }

    // ── Household score (0-20) ──
    let householdScore = 10;
    if (answers.household.kidAges !== "none") {
      if (c.household.minKidAge === 0 || c.household.minKidAge === null) householdScore += 5;
      else if (youngestKid >= c.household.minKidAge) householdScore += 2;
    }
    if (answers.household.hasOtherDogs) {
      if (c.household.dogCompatibility === "yes") householdScore += 3;
      else if (c.household.dogCompatibility === "conditional") { householdScore += 1; flags.push(c.household.dogNotes || "Dog compatibility is conditional"); }
    }
    if (answers.household.hasCats) {
      if (c.household.catCompatibility === "yes") householdScore += 2;
      else if (c.household.catCompatibility === "untested") { flags.push("Not cat-tested"); }
    }
    householdScore = Math.min(20, householdScore);

    // ── Experience score (0-20) ──
    let experienceScore = 10;
    const reactLevel = { none: 0, mild: 1, manageable: 2, needs_support: 3 };
    const expLevel = { first_timer: 0, some: 1, experienced: 2 };
    const userExp = expLevel[answers.experience];
    const dogReact = reactLevel[c.reactivity.overallLevel];

    if (dogReact === 0) {
      experienceScore = 20;
    } else if (userExp >= dogReact) {
      experienceScore = 18;
    } else if (userExp === dogReact - 1) {
      experienceScore = 8;
      flags.push("May be challenging for your experience level");
    } else {
      experienceScore = 2;
    }

    if (c.reactivity.leashReactive) flags.push("Working on leash skills");
    if (c.reactivity.fearBased) flags.push("Building confidence");
    if (c.reactivity.preyDrive && (answers.household.hasCats)) flags.push("Chasing instinct — check cat safety");

    // ── Size score (0-10) ──
    let sizeScore = 10;
    if (answers.sizePreference.length > 0) {
      if (answers.sizePreference.includes(c.size)) {
        sizeScore = 10;
      } else {
        const sizes = ["small", "medium", "large", "extra_large"];
        const dogIdx = sizes.indexOf(c.size);
        const minDist = Math.min(...answers.sizePreference.map((s) => Math.abs(sizes.indexOf(s) - dogIdx)));
        sizeScore = minDist === 1 ? 5 : 0;
      }
    }

    // ── Age score (0-10) ──
    let ageScore = 10;
    if (answers.agePreference.length > 0) {
      const dogAge = ageCategory(dog.ageYears);
      if (answers.agePreference.includes(dogAge)) {
        ageScore = 10;
      } else {
        const ages = ["puppy", "young", "adult", "senior"];
        const dogIdx = ages.indexOf(dogAge);
        const minDist = Math.min(...answers.agePreference.map((a) => Math.abs(ages.indexOf(a) - dogIdx)));
        ageScore = minDist === 1 ? 5 : 0;
      }
    }

    // ── Living score (0-5) ──
    let livingScore = 5;
    if (answers.livingSituation === "apartment") {
      if (!c.living.suitableForApartment) { livingScore = 0; flags.push("May not suit apartment living"); }
      if (c.living.needsYard) livingScore = 0;
    }
    if (c.living.needsYard && answers.livingSituation === "apartment") livingScore = 0;
    if (c.living.escapeRisk) flags.push("Adventurous — needs very secure fencing");

    const score = energyScore + attachmentScore + householdScore + experienceScore + sizeScore + ageScore + livingScore;

    results.push({
      dog,
      score,
      distanceKm: dist,
      breakdown: {
        energy: energyScore,
        attachment: attachmentScore,
        household: householdScore,
        experience: experienceScore,
        size: sizeScore,
        age: ageScore,
        living: livingScore,
      },
      flags,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
