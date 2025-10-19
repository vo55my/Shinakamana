import Image from "next/image";
import { RiUserVoiceFill } from "react-icons/ri";

export default function CharacterVoicesSection({ voices }) {
  if (!voices || voices.length === 0) {
    return null;
  }

  return (
    <section className="pb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center">
            <RiUserVoiceFill className="text-[#FFBD69] mr-2" />
            VOICE ACTORS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voices.map((voice) => (
              <div
                key={voice.person.mal_id}
                className="bg-[#0f0f1f] border border-[#543864] rounded-xl p-4 hover:border-[#FF6363] transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  {/* Voice Actor Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-[#FFBD69]">
                    {voice.person.images?.jpg?.image_url ? (
                      <Image
                        src={voice.person.images.jpg.image_url}
                        alt={voice.person.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-[#543864] text-white/40 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Voice Actor Info */}
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg">
                      {voice.person.name}
                    </h4>
                    <p className="text-[#FFBD69] text-sm font-medium">
                      {voice.language}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
