import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50">
        <div className="max-w-5xl mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-warm-gray-900 tracking-tight">
            Your perfect rescue dog
            <br />
            <span className="text-amber-600">is waiting</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-warm-gray-600 max-w-2xl mx-auto leading-relaxed">
            Answer a few questions about your lifestyle and we&apos;ll match you
            with rescue dogs across Australia that fit your home.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg shadow-amber-500/25"
            >
              Find Your Match
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-warm-gray-300 hover:border-warm-gray-400 text-warm-gray-700 px-8 py-4 rounded-full text-lg font-semibold transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-warm-gray-900">
          How it works
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              icon: "📋",
              title: "Take the quiz",
              desc: "Answer 8 quick questions about your lifestyle, household, and what you're looking for in a dog.",
            },
            {
              step: "2",
              icon: "🤖",
              title: "AI matching",
              desc: "We analyse rescue dog profiles using AI to understand each dog's personality, energy, and needs.",
            },
            {
              step: "3",
              icon: "🐕",
              title: "Meet your match",
              desc: "Browse your personalised matches, then follow the link to PetRescue to start the adoption process.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="text-center p-6 rounded-2xl bg-white border border-warm-gray-200 shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-warm-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-warm-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-warm-gray-50 border-y border-warm-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "100", label: "Dogs available" },
              { value: "8", label: "Quick questions" },
              { value: "AI", label: "Smart matching" },
              { value: "100%", label: "Free to use" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-amber-600">{stat.value}</div>
                <div className="mt-1 text-sm text-warm-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-warm-gray-900">
          Ready to find your new best friend?
        </h2>
        <p className="mt-4 text-warm-gray-600 text-lg">
          It only takes a minute. Every match links back to the rescue org.
        </p>
        <Link
          href="/quiz"
          className="mt-8 inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg shadow-amber-500/25"
        >
          Start the Quiz
        </Link>
      </section>
    </div>
  );
}
