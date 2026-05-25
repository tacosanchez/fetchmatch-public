import { Suspense } from "react";
import Link from "next/link";
import { dogs } from "@/lib/dogs";
import { matchDogs } from "@/lib/matching";
import type { QuizAnswers } from "@/lib/types";

const GRADIENTS = [
  "from-amber-400 to-orange-400",
  "from-teal-400 to-cyan-400",
  "from-violet-400 to-purple-400",
  "from-rose-400 to-pink-400",
  "from-emerald-400 to-green-400",
  "from-blue-400 to-indigo-400",
  "from-yellow-400 to-amber-400",
  "from-fuchsia-400 to-pink-400",
];

function getGradient(id: string) {
  return GRADIENTS[parseInt(id) % GRADIENTS.length];
}

function formatLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ScoreBadge({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color =
    pct >= 80 ? "bg-emerald-100 text-emerald-700"
    : pct >= 60 ? "bg-amber-100 text-amber-700"
    : "bg-warm-gray-100 text-warm-gray-600";
  return <span className={`${color} px-3 py-1 rounded-full text-sm font-bold`}>{pct}% match</span>;
}

async function ResultsContent({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const p = await searchParams;

  const answers: QuizAnswers = {
    activityLevel: (p.activityLevel as QuizAnswers["activityLevel"]) || "moderate",
    household: {
      kidAges: (p.kidAges as QuizAnswers["household"]["kidAges"]) || "none",
      hasOtherDogs: p.hasOtherDogs === "true",
      hasCats: p.hasCats === "true",
    },
    aloneTime: (p.aloneTime as QuizAnswers["aloneTime"]) || "few_hours",
    experience: (p.experience as QuizAnswers["experience"]) || "first_timer",
    sizePreference: p.sizePreference && p.sizePreference !== "any" ? p.sizePreference.split(",") as QuizAnswers["sizePreference"] : [],
    agePreference: p.agePreference && p.agePreference !== "any" ? p.agePreference.split(",") as QuizAnswers["agePreference"] : [],
    livingSituation: (p.livingSituation as QuizAnswers["livingSituation"]) || "house_small_yard",
    location: {
      postcode: p.postcode || "2000",
      radiusKm: parseInt(p.radiusKm || "0") || 0,
    },
  };

  const results = matchDogs(dogs, answers);
  const topResults = results.slice(0, 20);
  const maxScore = 100;

  if (topResults.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🐕</div>
        <h2 className="text-2xl font-bold text-warm-gray-900">No matches found</h2>
        <p className="mt-2 text-warm-gray-600">Try expanding your search radius or adjusting your preferences.</p>
        <Link href="/quiz" className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
          Retake Quiz
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-warm-gray-900">Your matches</h1>
        <p className="mt-2 text-warm-gray-600 text-lg">
          We found {topResults.length} dogs that suit your lifestyle
          {answers.location.radiusKm > 0 && ` within ${answers.location.radiusKm}km`}.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {topResults.map((result, i) => (
          <Link
            key={result.dog.id}
            href={`/dog/${result.dog.id}`}
            className="group bg-white rounded-2xl border border-warm-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`aspect-[4/3] bg-gradient-to-br ${getGradient(result.dog.id)} flex items-center justify-center relative overflow-hidden`}>
              {result.dog.photos[0] ? (
                <img src={result.dog.photos[0]} alt={result.dog.name} className="w-full h-full object-cover object-top" />
              ) : (
                <span className="text-6xl opacity-90">🐕</span>
              )}
              {i === 0 && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-amber-600">
                  Best Match
                </div>
              )}
              <div className="absolute top-3 right-3">
                <ScoreBadge score={result.score} max={maxScore} />
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-warm-gray-900 group-hover:text-amber-600 transition-colors">
                    {result.dog.name}
                  </h2>
                  <p className="text-warm-gray-500 text-sm">
                    {result.dog.breed} · {result.dog.ageLabel} · {result.dog.gender}
                  </p>
                </div>
                {result.distanceKm !== null && (
                  <span className="text-xs text-warm-gray-500 bg-warm-gray-100 px-2 py-1 rounded-full">
                    {result.distanceKm} km
                  </span>
                )}
              </div>

              <p className="mt-3 text-warm-gray-600 text-sm leading-relaxed">
                {result.dog.classification.summary}
              </p>

              {result.flags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {result.flags.slice(0, 2).map((flag) => (
                    <span key={flag} className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {flag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-warm-gray-100 text-warm-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                  {formatLabel(result.dog.classification.energy.physical)} energy
                </span>
                <span className="bg-warm-gray-100 text-warm-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                  {formatLabel(result.dog.classification.size)}
                </span>
                <span className="bg-warm-gray-100 text-warm-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                  📍 {result.dog.location}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/quiz" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
          ← Retake the quiz
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Suspense fallback={
        <div className="text-center py-20">
          <div className="text-4xl animate-bounce">🐾</div>
          <p className="mt-4 text-warm-gray-500">Finding your matches...</p>
        </div>
      }>
        <ResultsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
