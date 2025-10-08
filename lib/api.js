const BASE_URL = "https://api.jikan.moe/v4";

const routes = {
  anime: {
    getAnimeFullById: (id) => `${BASE_URL}/anime/${id}/full`,
    getAnimeCharacters: (id) => `${BASE_URL}/anime/${id}/characters`,
    getAnimeEpisodes: (id) => `${BASE_URL}/anime/${id}/episodes`,
    getAnimeRecommendations: (id) => `${BASE_URL}/anime/${id}/recommendations`,
    getAnimeRelations: (id) => `${BASE_URL}/anime/${id}/relations`,
    getAnimeSearch: (params = "") => `${BASE_URL}/anime?${params}`,
  },
  genre: {
    getAnimeGenres: () => `${BASE_URL}/genres/anime`,
  },
  recommendations: {
    getRecentAnimeRecommendations: () => `${BASE_URL}/recommendations/anime`,
  },
  schedules: {
    getSchedules: (params = "") => `${BASE_URL}/schedules?${params}`,
  },
  season: {
    getSeasonNow: (params = "") => `${BASE_URL}/seasons/now?${params}`,
    getSeason: (year, season, params = "") =>
      `${BASE_URL}/seasons/${year}/${season}${params ? `?${params}` : ""}`,
    getSeasonsList: () => `${BASE_URL}/seasons`,
    getSeasonUpcoming: (params = "") =>
      `${BASE_URL}/seasons/upcoming?${params}`,
  },
  top: {
    getTopAnime: (params = "") => `${BASE_URL}/top/anime?${params}`,
  },
};

// HELPER FUNCTION
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// ANIME API
export const getAnimeFullById = (id) =>
  fetchWithRetry(routes.anime.getAnimeFullById(id));

export const getAnimeCharacters = (id) =>
  fetchWithRetry(routes.anime.getAnimeCharacters(id));

export const getAnimeEpisodes = (id, page = 1) =>
  fetchWithRetry(`${routes.anime.getAnimeEpisodes(id)}?page=${page}`);

export const getAnimeRecommendations = (id) =>
  fetchWithRetry(routes.anime.getAnimeRecommendations(id));

export const getAnimeRelations = (id) =>
  fetchWithRetry(routes.anime.getAnimeRelations(id));

export const getAnimeSearch = (params) =>
  fetchWithRetry(routes.anime.getAnimeSearch(params));

//  GENRE API
export const getAnimeGenres = () =>
  fetchWithRetry(routes.genre.getAnimeGenres());

//  RECOMMENDATION API
export const getRecentAnimeRecommendations = () =>
  fetchWithRetry(routes.recommendations.getRecentAnimeRecommendations());

// SCHEDULE API
export const getSchedules = (params) =>
  fetchWithRetry(routes.schedules.getSchedules(params));

// SEASON API
export const getSeasonNow = (params) =>
  fetchWithRetry(routes.season.getSeasonNow(params));

export const getSeason = (year, season, params) =>
  fetchWithRetry(routes.season.getSeason(year, season, params));

export const getSeasonsList = () =>
  fetchWithRetry(routes.season.getSeasonsList());

export const getSeasonUpcoming = (params) =>
  fetchWithRetry(routes.season.getSeasonUpcoming(params));

// TOP API
export const getTopAnime = (params) =>
  fetchWithRetry(routes.top.getTopAnime(params));
