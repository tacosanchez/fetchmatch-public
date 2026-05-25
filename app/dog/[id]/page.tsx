import Link from "next/link";
import { notFound } from "next/navigation";
import { dogs } from "@/lib/dogs";
import type { Compatibility } from "@/lib/types";

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

function TraitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-warm-gray-100 last:border-0">
      <span className="text-warm-gray-600">{label}</span>
      <span className="font-medium text-warm-gray-900">{value}</span>
    </div>
  );
}

function CompatBadge({ label, status, note }: { label: string; status: Compatibility | string; note?: string }) {
  const config = {
    yes: { color: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: "✓" },
    no: { color: "border-red-200 bg-red-50 text-red-600", icon: "✗" },
    conditional: { color: "border-amber-200 bg-amber-50 text-amber-700", icon: "~" },
    untested: { color: "border-warm-gray-200 bg-warm-gray-50 text-warm-gray-500", icon: "?" },
  };
  const c = config[status as keyof typeof config] || config.untested;

  return (
    <div className={`flex flex-col gap-1 px-4 py-2.5 rounded-xl border ${c.color}`}>
      <div className="flex items-center gap-2">
        <span>{c.icon}</span>
        <span className="font-medium text-sm">{label}</span>
      </div>
      {note && <span className="text-xs opacity-75 ml-6">{note}</span>}
    </div>
  );
}

function ReactivityFlag({ label, active }: { label: string; active: boolean }) {
  if (!active) return null;
  return (
    <span className="bg-amber-100 text-amber-700 border border-amber-300 px-3 py-1 rounded-full text-xs font-medium">
      {label}
    </span>
  );
}

function getPhotoVariant(src: string, transform: string) {
  return src.replace("b_auto:predominant,c_pad,f_auto,h_648,w_648", transform);
}

function HeroDogPhoto({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return <span className="relative z-10 text-8xl opacity-90">Dog</span>;
  }

  const backdropSrc = getPhotoVariant(src, "c_fill,g_auto,f_auto,h_648,w_648");
  const foregroundSrc = getPhotoVariant(src, "c_fit,f_auto,h_648,w_648");

  return (
    <>
      <img
        src={backdropSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
      />
      <div className="absolute inset-0 bg-black/5" />
      <img
        src={foregroundSrc}
        alt={alt}
        className="relative z-10 h-full w-full object-contain"
      />
    </>
  );
}

export default async function DogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dog = dogs.find((d) => d.id === id);
  if (!dog) notFound();

  const c = dog.classification;
  const kidLabel = c.household.minKidAge === null ? "All ages" : c.household.minKidAge === 0 ? "All ages" : c.household.minKidAge === 18 ? "Adults only" : `${c.household.minKidAge}+ years`;
  const hasReactivity = c.reactivity.overallLevel !== "none";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/results" className="inline-block mb-6 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors">
        ← Back to results
      </Link>

      <div className={`relative h-64 md:h-80 rounded-2xl bg-gradient-to-br ${getGradient(dog.id)} flex items-center justify-center mb-8 overflow-hidden`}>
        <HeroDogPhoto src={dog.photos[0]} alt={dog.name} />
      </div>

      {dog.photos.length > 1 && (
        <div className="flex gap-3 mb-8 overflow-x-auto">
          {dog.photos.slice(1, 4).map((photo, i) => (
            <div key={i} className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 border border-warm-gray-200">
              <img src={photo} alt={`${dog.name} photo ${i + 2}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-warm-gray-900">{dog.name}</h1>
          <p className="mt-1 text-warm-gray-500 text-lg">
            {dog.breed} · {dog.ageLabel} · {dog.gender}{dog.weightKg ? ` · ${dog.weightKg}kg` : ""}
          </p>
          <p className="mt-1 text-warm-gray-500">📍 {dog.location}</p>
          <p className="mt-1 text-warm-gray-500 text-sm">{dog.rescueOrg} · {dog.adoptionFee}</p>
        </div>
        <a
          href={dog.petrescueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-colors text-center shadow-lg shadow-amber-500/25"
        >
          View on PetRescue →
        </a>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-amber-800 mb-1">AI Summary</h2>
        <p className="text-amber-900 leading-relaxed">{c.summary}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-warm-gray-900 mb-3">About {dog.name}</h2>
        <div className="text-warm-gray-600 leading-relaxed space-y-3">
          {dog.description.split(/\.(?=[A-Z])/).map((chunk, i, arr) => (
            <p key={i}>{chunk.trim()}{i < arr.length - 1 ? "." : ""}</p>
          ))}
        </div>
      </div>

      {/* Personality */}
      <div className="bg-white border border-warm-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-xl font-bold text-warm-gray-900 mb-4">Personality Profile</h2>
        <TraitRow label="Physical Energy" value={formatLabel(c.energy.physical)} />
        <TraitRow label="Mental Stimulation" value={formatLabel(c.energy.mental)} />
        <TraitRow label="Bonding Style" value={formatLabel(c.attachment.bondingStyle)} />
        <TraitRow label="Alone Time Tolerance" value={formatLabel(c.attachment.aloneTimeTolerance)} />
        <TraitRow label="Stranger Confidence" value={formatLabel(c.strangerConfidence)} />
        <TraitRow label="Size" value={formatLabel(c.size)} />
        <TraitRow label="Training Level" value={formatLabel(c.training.level)} />
        <TraitRow label="Leash Manners" value={formatLabel(c.training.leashManners)} />
      </div>

      {/* Household */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-warm-gray-900 mb-4">Household Compatibility</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <CompatBadge label={`Kids: ${kidLabel}`} status={c.household.minKidAge === 18 ? "no" : c.household.minKidAge === null || c.household.minKidAge === 0 ? "yes" : "conditional"} />
          <CompatBadge label="Dog Friendly" status={c.household.dogCompatibility} note={c.household.dogNotes || undefined} />
          <CompatBadge label="Cat Friendly" status={c.household.catCompatibility} />
          <CompatBadge label="Apartment OK" status={c.living.suitableForApartment ? "yes" : "no"} />
        </div>
      </div>

      {/* Reactivity */}
      {hasReactivity && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-warm-gray-900 mb-4">Things to know</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 mb-3">
              Support level: <span className="font-bold">{formatLabel(c.reactivity.overallLevel)}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <ReactivityFlag label="Working on leash skills" active={c.reactivity.leashReactive} />
              <ReactivityFlag label="Building confidence" active={c.reactivity.fearBased} />
              <ReactivityFlag label="Chasing instinct" active={c.reactivity.preyDrive} />
              <ReactivityFlag label="Learning to share" active={c.reactivity.resourceGuarding} />
            </div>
          </div>
        </div>
      )}

      {/* Training & Living */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-warm-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-warm-gray-900 mb-3">Training</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-warm-gray-600">Housetrained</span><span>{c.training.housetrained ? "✓" : "✗"}</span></div>
            <div className="flex justify-between"><span className="text-warm-gray-600">Crate trained</span><span>{c.training.crateTrained ? "✓" : "✗"}</span></div>
            <div className="flex justify-between"><span className="text-warm-gray-600">Recall</span><span>{formatLabel(c.training.recall)}</span></div>
            <div className="flex justify-between"><span className="text-warm-gray-600">Food motivated</span><span>{c.training.foodMotivated ? "✓" : "✗"}</span></div>
          </div>
        </div>
        <div className="bg-white border border-warm-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-warm-gray-900 mb-3">Living Requirements</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-warm-gray-600">Needs yard</span><span>{c.living.needsYard ? "✓" : "✗"}</span></div>
            {c.living.fencingMinMetres && <div className="flex justify-between"><span className="text-warm-gray-600">Min fencing</span><span>{c.living.fencingMinMetres}m</span></div>}
            <div className="flex justify-between"><span className="text-warm-gray-600">Indoor required</span><span>{c.living.indoorRequired ? "✓" : "✗"}</span></div>
            <div className="flex justify-between"><span className="text-warm-gray-600">Low stairs</span><span>{c.living.lowStairs ? "Needed" : "Fine"}</span></div>
            {c.living.escapeRisk && <div className="flex justify-between"><span className="text-warm-gray-600">Escape risk</span><span className="text-red-600 font-medium">Yes</span></div>}
          </div>
        </div>
      </div>

      {c.attachment.separationAnxiety && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Loves company:</span> {dog.name} feels most comfortable with people nearby and is happiest in a home where someone is around most of the time.
          </p>
        </div>
      )}

      <div className="bg-warm-gray-50 border border-warm-gray-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold text-warm-gray-900">Interested in {dog.name}?</h3>
        <p className="mt-2 text-warm-gray-600 text-sm">
          {dog.name} is listed on PetRescue via {dog.rescueOrg}. Contact the rescue directly to enquire.
        </p>
        <a
          href={dog.petrescueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Enquire on PetRescue
        </a>
      </div>
    </div>
  );
}
