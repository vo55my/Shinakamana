import API_ENDPOINT from '../globals/api-endpoint';

class AnimeSource {
  static async seasonAnime() {
    const response = await fetch(API_ENDPOINT.SEASON);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async favoriteAnime() {
    const response = await fetch(API_ENDPOINT.FAVORITE);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async popularAnime() {
    const response = await fetch(API_ENDPOINT.POPULER);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async ongoingAnime() {
    const response = await fetch(API_ENDPOINT.ONGOING);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async genreAnime() {
    const response = await fetch(API_ENDPOINT.GENRE);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async detailAnime(id) {
    const response = await fetch(API_ENDPOINT.DETAIL(id));
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async categoryGenre(id) {
    const response = await fetch(API_ENDPOINT.CATEGORY(id));
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async resultAnime(keyword) {
    const response = await fetch(API_ENDPOINT.SEARCH(keyword));
    const responseJson = await response.json();
    return responseJson.data;
  }
}

export default AnimeSource;
