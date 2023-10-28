import CONFIG from './config';

const API_ENDPOINT = {
  FAVORITE: `${CONFIG.BASE_TOP_URL}?filter=favorite&sfw`, // Pagination
  POPULER: `${CONFIG.BASE_TOP_URL}?filter=bypopularity&sfw`, // Pagination
  ONGOING: `${CONFIG.BASE_TOP_URL}?filter=airing&sfw`, // Pagination
  SEASON: `${CONFIG.BASE_SEASONS_URL}now?sfw`, // Pagination
  GENRE: `${CONFIG.BASE_GENRE_URL}?filter=genres`,
  DETAIL: (id) => `${CONFIG.BASE_ANIME_URL}/${id}/full`,
  CATEGORY: (id) => `${CONFIG.BASE_ANIME_URL}?genres=${id}&order_by=popularity&sort=asc&sfw`, // Pagination
  RESULT: (keyword) => `${CONFIG.BASE_ANIME_URL}?q=${keyword}`,
};

export default API_ENDPOINT;
