"use client";

export default function LoadingState() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-80 h-96 bg-[#543864]/50 rounded-xl"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-[#543864]/50 rounded w-3/4"></div>
              <div className="h-4 bg-[#543864]/50 rounded w-1/2"></div>
              <div className="h-4 bg-[#543864]/50 rounded w-2/3"></div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-[#543864]/50 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
