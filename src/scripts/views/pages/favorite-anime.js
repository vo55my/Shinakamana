import AnimeSource from '../../data/anime-source';
import { createFavoriteAnimeItemTemplate, loading, failedLoad } from '../templates/template-creator';

const Favorite = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
      <h1 class="my-4 judul text-center">Anime Terbaik</h1>
      <div id="favorite" class="favorite row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2"></div>
    </div>
    <footer-section></footer-section>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      const favorite = await AnimeSource.favoriteAnime();
      const favoriteContainer = document.querySelector('#favorite');
      favorite.forEach((favoriteAnime) => {
        favoriteContainer.innerHTML += createFavoriteAnimeItemTemplate(favoriteAnime);
      });
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Favorite;
