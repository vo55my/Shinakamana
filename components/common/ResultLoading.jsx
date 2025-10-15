import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AnimeCard from "@/components/cards/AnimeCard";

export default function ResultLoading({
  title = "RESULTS",
  icon = null,
  headerPulse = null,
  controlsPulse = null,
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />
      <main className="flex-1 py-20">
        {/* Header Loading */}
        <section className="relative py-12 bg-gradient-to-r from-[#0f0f1f] to-[#1a1a2f] border-b border-[#543864]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-[#FF6363] rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                  {title}
                </h1>
                <div className="w-3 h-3 bg-[#FFBD69] rounded-full"></div>
              </div>
              {headerPulse ?? (
                <div className="h-6 bg-[#543864]/50 rounded w-64 animate-pulse"></div>
              )}
            </div>
          </div>
        </section>
        {/* Controls Loading */}
        <section className="py-8 bg-[#0f0f1f]">
          <div className="container mx-auto px-4 sm:px-6">
            {controlsPulse ?? (
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                {icon}
                <div className="h-12 bg-[#543864]/50 rounded-xl animate-pulse w-48"></div>
                <div className="h-12 bg-[#543864]/50 rounded-xl animate-pulse w-48"></div>
              </div>
            )}
          </div>
        </section>
        {/* Content Loading */}
        <section className="py-8 bg-[#1a1a2f]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
              {Array.from({ length: 10 }).map((_, i) => (
                <AnimeCard key={i} loading />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
