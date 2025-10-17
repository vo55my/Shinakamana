// Helper: filter broadcast
export function filterByBroadcast(animeList, filterType = "tv") {
  if (!Array.isArray(animeList)) return [];
  if (filterType === "movie") return animeList;
  return animeList.filter((anime) => {
    const b = anime?.broadcast;
    if (!b?.string) return false;
    const str = String(b.string).trim().toLowerCase();
    if (!str || str === "unknown") return false;
    if (b.timezone === null) return false;
    return true;
  });
}