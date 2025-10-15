import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function SSRLoadingFallback() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2f]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </main>
      <Footer />
    </div>
  );
}
