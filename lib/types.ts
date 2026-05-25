// ── Dog-side classification (extracted by LLM from listing) ──

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  ageLabel: string;
  gender: "Male" | "Female";
  weightKg: number | null;
  location: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
  description: string;
  photos: string[];
  petrescueUrl: string;
  rescueOrg: string;
  adoptionFee: string;

  classification: DogClassification;
}

export interface DogClassification {
  energy: {
    physical: EnergyLevel;
    mental: MentalStimulation;
  };

  attachment: {
    bondingStyle: BondingStyle;
    aloneTimeTolerance: AloneTimeTolerance;
    separationAnxiety: boolean;
  };

  strangerConfidence: StrangerConfidence;

  household: {
    minKidAge: number | null;
    dogCompatibility: Compatibility;
    dogNotes: string;
    catCompatibility: Compatibility;
  };

  reactivity: {
    leashReactive: boolean;
    fearBased: boolean;
    preyDrive: boolean;
    resourceGuarding: boolean;
    overallLevel: ReactivityLevel;
  };

  training: {
    level: TrainingLevel;
    housetrained: boolean;
    crateTrained: boolean;
    leashManners: LeashManners;
    recall: ReliabilityLevel;
    foodMotivated: boolean;
  };

  living: {
    needsYard: boolean;
    fencingMinMetres: number | null;
    indoorRequired: boolean;
    suitableForApartment: boolean;
    lowStairs: boolean;
    escapeRisk: boolean;
  };

  size: Size;

  summary: string;
  classificationConfidence: Confidence;
}

export type EnergyLevel = "low" | "moderate" | "high" | "very_high";
export type MentalStimulation = "low" | "moderate" | "high";
export type BondingStyle = "velcro" | "loyal" | "independent" | "one_person";
export type AloneTimeTolerance = "needs_company" | "some_time" | "independent";
export type StrangerConfidence = "friendly" | "warming_up" | "shy" | "needs_time";
export type Compatibility = "yes" | "no" | "conditional" | "untested";
export type ReactivityLevel = "none" | "mild" | "manageable" | "needs_support";
export type TrainingLevel = "well_trained" | "knows_basics" | "learning" | "fresh_start";
export type LeashManners = "good" | "learning" | "needs_work";
export type ReliabilityLevel = "reliable" | "developing" | "learning" | "unknown";
export type Size = "small" | "medium" | "large" | "extra_large";
export type Confidence = "high" | "medium" | "low";

// ── User-side quiz answers ──

export interface QuizAnswers {
  activityLevel: "couch" | "moderate" | "active" | "very_active";
  household: {
    kidAges: "none" | "under_5" | "5_to_12" | "teens";
    hasOtherDogs: boolean;
    hasCats: boolean;
  };
  aloneTime: "rarely" | "few_hours" | "full_day";
  experience: "first_timer" | "some" | "experienced";
  sizePreference: Size[];
  agePreference: ("puppy" | "young" | "adult" | "senior")[];
  livingSituation: "apartment" | "house_small_yard" | "house_large_yard" | "acreage";
  location: {
    postcode: string;
    radiusKm: number;
  };
}

// ── Match result ──

export interface MatchResult {
  dog: DogProfile;
  score: number;
  distanceKm: number | null;
  breakdown: {
    energy: number;
    attachment: number;
    household: number;
    experience: number;
    size: number;
    age: number;
    living: number;
  };
  flags: string[];
}
