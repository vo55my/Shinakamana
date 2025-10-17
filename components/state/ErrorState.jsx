"use client";

export default function ErrorState({ error }) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-8 text-center">
          <div className="text-[#FF6363] text-lg font-semibold mb-2">
            {error}
          </div>
          <p className="text-white/60">Please try refreshing the page</p>
        </div>
      </div>
    </section>
  );
}
