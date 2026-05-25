"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface QuizState {
  activityLevel: string;
  kidAges: string;
  hasOtherDogs: boolean;
  hasCats: boolean;
  aloneTime: string;
  experience: string;
  sizePreference: string[];
  agePreference: string[];
  livingSituation: string;
  postcode: string;
  radiusKm: string;
}

type StepConfig = {
  key: string;
  question: string;
  subtitle: string;
  type: "single" | "multi" | "household" | "location";
  options?: { value: string; label: string; icon: string; desc: string }[];
};

const STEPS: StepConfig[] = [
  {
    key: "activityLevel",
    question: "How active are you?",
    subtitle: "This helps us match your energy level with the right dog.",
    type: "single",
    options: [
      { value: "couch", label: "I love the couch", icon: "🛋️", desc: "Short walks are plenty. Relaxing is my sport." },
      { value: "moderate", label: "Daily walks sound great", icon: "🚶", desc: "I enjoy getting outside but also love downtime." },
      { value: "active", label: "I run or hike regularly", icon: "🏃", desc: "I want a dog that can keep up." },
      { value: "very_active", label: "Athlete-level active", icon: "⛰️", desc: "Long runs, big hikes, all-day adventures." },
    ],
  },
  {
    key: "household",
    question: "What's your household like?",
    subtitle: "We'll filter out dogs that aren't a good fit for your home.",
    type: "household",
  },
  {
    key: "aloneTime",
    question: "How much time will the dog be alone?",
    subtitle: "Some dogs handle alone time better than others.",
    type: "single",
    options: [
      { value: "rarely", label: "Rarely — I work from home", icon: "🏠", desc: "The dog will almost always have company." },
      { value: "few_hours", label: "A few hours a day", icon: "⏰", desc: "I'm out part of the day but home for most of it." },
      { value: "full_day", label: "Standard work day (8+ hours)", icon: "💼", desc: "The dog needs to be comfortable alone." },
    ],
  },
  {
    key: "experience",
    question: "Have you had dogs before?",
    subtitle: "This helps us gauge which dogs would be the best fit.",
    type: "single",
    options: [
      { value: "first_timer", label: "First dog ever", icon: "🌱", desc: "I'm a complete beginner — guide me!" },
      { value: "some", label: "Had dogs growing up", icon: "📚", desc: "I know the basics but I'm no expert." },
      { value: "experienced", label: "Experienced owner", icon: "🏅", desc: "I've trained dogs and can handle challenges." },
    ],
  },
  {
    key: "sizePreference",
    question: "Size preference?",
    subtitle: "Pick as many as you like, or leave blank for no preference.",
    type: "multi",
    options: [
      { value: "small", label: "Small (under 10kg)", icon: "🐕‍🦺", desc: "Lap-sized companion." },
      { value: "medium", label: "Medium (10–25kg)", icon: "🐕", desc: "Not too big, not too small." },
      { value: "large", label: "Large (25kg+)", icon: "🦮", desc: "A proper big dog." },
    ],
  },
  {
    key: "agePreference",
    question: "Age preference?",
    subtitle: "Pick as many as you like, or leave blank for no preference.",
    type: "multi",
    options: [
      { value: "puppy", label: "Puppy (under 1)", icon: "🐶", desc: "A blank slate — lots of training and energy." },
      { value: "young", label: "Young (1–3 years)", icon: "⚡", desc: "Past the puppy chaos but still full of life." },
      { value: "adult", label: "Adult (3–8 years)", icon: "🐾", desc: "Settled personality, what you see is what you get." },
      { value: "senior", label: "Senior (8+)", icon: "🤍", desc: "Calm, grateful, and often overlooked." },
    ],
  },
  {
    key: "livingSituation",
    question: "What's your living situation?",
    subtitle: "Some dogs need a yard, others thrive in apartments.",
    type: "single",
    options: [
      { value: "apartment", label: "Apartment / unit", icon: "🏢", desc: "No private outdoor space." },
      { value: "house_small_yard", label: "House with small yard", icon: "🏡", desc: "Some outdoor space but compact." },
      { value: "house_large_yard", label: "House with large yard", icon: "🏠", desc: "Plenty of room to run around." },
      { value: "acreage", label: "Acreage / rural", icon: "🌾", desc: "Wide open spaces." },
    ],
  },
  {
    key: "location",
    question: "Where are you located?",
    subtitle: "Enter your postcode and how far you're willing to travel.",
    type: "location",
  },
];

const KID_OPTIONS = [
  { value: "none", label: "No children" },
  { value: "under_5", label: "Kids under 5" },
  { value: "5_to_12", label: "Kids 5–12" },
  { value: "teens", label: "Teenagers only" },
];

const RADIUS_OPTIONS = [
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
  { value: "200", label: "200 km" },
  { value: "0", label: "Anywhere" },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizState>({
    activityLevel: "",
    kidAges: "",
    hasOtherDogs: false,
    hasCats: false,
    aloneTime: "",
    experience: "",
    sizePreference: [],
    agePreference: [],
    livingSituation: "",
    postcode: "",
    radiusKm: "50",
  });

  const current = STEPS[step];

  function canProceed(): boolean {
    switch (current.key) {
      case "household": return answers.kidAges !== "";
      case "location": return answers.postcode.length >= 4;
      case "sizePreference":
      case "agePreference":
        return true;
      default: return (answers as unknown as Record<string, unknown>)[current.key] !== "";
    }
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      const params = new URLSearchParams({
        activityLevel: answers.activityLevel,
        kidAges: answers.kidAges,
        hasOtherDogs: String(answers.hasOtherDogs),
        hasCats: String(answers.hasCats),
        aloneTime: answers.aloneTime,
        experience: answers.experience,
        sizePreference: answers.sizePreference.join(",") || "any",
        agePreference: answers.agePreference.join(",") || "any",
        livingSituation: answers.livingSituation,
        postcode: answers.postcode,
        radiusKm: answers.radiusKm,
      });
      router.push(`/results?${params.toString()}`);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-warm-gray-500 mb-2">
          <span>Question {step + 1} of {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-warm-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-warm-gray-900">{current.question}</h1>
        <p className="mt-2 text-warm-gray-500">{current.subtitle}</p>
      </div>

      {/* Content */}
      {current.type === "single" && current.options && (
        <div className="grid gap-3">
          {current.options.map((opt) => {
            const selected = (answers as unknown as Record<string, unknown>)[current.key] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setAnswers((prev) => ({ ...prev, [current.key]: opt.value }))}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-amber-500 bg-amber-50 shadow-sm"
                    : "border-warm-gray-200 bg-white hover:border-warm-gray-300 hover:bg-warm-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-warm-gray-900">{opt.label}</div>
                    {opt.desc && <div className="text-sm text-warm-gray-500 mt-0.5">{opt.desc}</div>}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selected ? "border-amber-500 bg-amber-500" : "border-warm-gray-300"
                  }`}>
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {current.type === "multi" && current.options && (
        <div className="grid gap-3">
          {current.options.map((opt) => {
            const arr = (answers as unknown as Record<string, string[]>)[current.key] ?? [];
            const selected = arr.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() =>
                  setAnswers((prev) => {
                    const cur = (prev as unknown as Record<string, string[]>)[current.key] ?? [];
                    const next = selected ? cur.filter((v) => v !== opt.value) : [...cur, opt.value];
                    return { ...prev, [current.key]: next };
                  })
                }
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-amber-500 bg-amber-50 shadow-sm"
                    : "border-warm-gray-200 bg-white hover:border-warm-gray-300 hover:bg-warm-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-warm-gray-900">{opt.label}</div>
                    {opt.desc && <div className="text-sm text-warm-gray-500 mt-0.5">{opt.desc}</div>}
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selected ? "border-amber-500 bg-amber-500" : "border-warm-gray-300"
                  }`}>
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {current.type === "household" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-warm-gray-700 mb-2">Children in the home</label>
            <div className="grid grid-cols-2 gap-3">
              {KID_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers((prev) => ({ ...prev, kidAges: opt.value }))}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    answers.kidAges === opt.value
                      ? "border-amber-500 bg-amber-50 text-warm-gray-900"
                      : "border-warm-gray-200 bg-white text-warm-gray-600 hover:border-warm-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-gray-700 mb-2">Other pets</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAnswers((prev) => ({ ...prev, hasOtherDogs: !prev.hasOtherDogs }))}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2 justify-center ${
                  answers.hasOtherDogs
                    ? "border-amber-500 bg-amber-50 text-warm-gray-900"
                    : "border-warm-gray-200 bg-white text-warm-gray-600 hover:border-warm-gray-300"
                }`}
              >
                <span>🐕</span> Other dogs
              </button>
              <button
                onClick={() => setAnswers((prev) => ({ ...prev, hasCats: !prev.hasCats }))}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2 justify-center ${
                  answers.hasCats
                    ? "border-amber-500 bg-amber-50 text-warm-gray-900"
                    : "border-warm-gray-200 bg-white text-warm-gray-600 hover:border-warm-gray-300"
                }`}
              >
                <span>🐱</span> Cats
              </button>
            </div>
          </div>
        </div>
      )}

      {current.type === "location" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-warm-gray-700 mb-2">Your postcode</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={answers.postcode}
              onChange={(e) => setAnswers((prev) => ({ ...prev, postcode: e.target.value.replace(/\D/g, "") }))}
              placeholder="e.g. 2000"
              className="w-full p-4 rounded-xl border-2 border-warm-gray-200 bg-white text-warm-gray-900 text-lg focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-gray-700 mb-2">How far are you willing to travel?</label>
            <div className="grid grid-cols-5 gap-2">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers((prev) => ({ ...prev, radiusKm: opt.value }))}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    answers.radiusKm === opt.value
                      ? "border-amber-500 bg-amber-50 text-warm-gray-900"
                      : "border-warm-gray-200 bg-white text-warm-gray-600 hover:border-warm-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
          className={`px-6 py-3 rounded-full font-semibold transition-colors ${
            step === 0
              ? "text-warm-gray-300 cursor-not-allowed"
              : "text-warm-gray-600 hover:text-warm-gray-900 hover:bg-warm-gray-100"
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            canProceed()
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25"
              : "bg-warm-gray-200 text-warm-gray-400 cursor-not-allowed"
          }`}
        >
          {step === STEPS.length - 1 ? "See My Matches" : "Next"}
        </button>
      </div>
    </div>
  );
}
