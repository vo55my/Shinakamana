import Image from "next/image";
import Link from "next/link";
import { FiPlay } from "react-icons/fi";

export default function CharacterAnimeSection({ animeography }) {
  if (!animeography || animeography.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#1a1a2f] border border-[#543864] rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center">
            <FiPlay className="text-[#FFBD69] mr-2" />
            ANIME APPEARANCES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {animeography.map((anime) => (
              <Link
                key={anime.anime.mal_id}
                href={`/anime/${anime.anime.mal_id}`}
                className="block"
              >
                <div className="bg-[#0f0f1f] border border-[#543864] rounded-xl p-4 hover:border-[#FF6363] transition-all duration-300 group h-full">
                  <div className="flex items-start space-x-4">
                    {/* Anime Image */}
                    <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden">
                      {anime.anime.images?.jpg?.image_url ? (
                        <Image
                          src={anime.anime.images.jpg.image_url}
                          alt={anime.anime.title}
                          width={64}
                          height={80}
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-16 h-20 flex items-center justify-center bg-[#543864] text-white/40 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Anime Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm leading-tight group-hover:text-[#FFBD69] transition-colors line-clamp-2">
                        {anime.anime.title}
                      </h4>
                      <p className="text-[#FF6363] text-xs font-medium mt-1">
                        {anime.role}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
