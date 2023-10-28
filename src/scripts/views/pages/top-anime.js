import AnimeSource from '../../data/anime-source';
import {
  createPopularAnimeItemTemplate,
  createFavoriteAnimeItemTemplate,
  createOngoingAnimeItemTemplate,
  loading,
  failedLoad,
} from '../templates/template-creator';

const Top = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
      <a href="#/ongoing-anime" class="text-decoration-none" id="item">
        <h3 class="my-4">Anime Sedang Tayang <i class="bi bi-chevron-right"></i></h3>
      </a>
      <div id="ongoing" class="animes row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2"></div>

      <a href="#/favorite-anime" class="text-decoration-none" id="item">
        <h3 class="my-4">Anime Terfavorit <i class="bi bi-chevron-right"></i></h3>
      </a>
      <div id="favorite" class="animes row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2"></div>

      <a href="#/popular-anime" class="text-decoration-none" id="item">
        <h3 class="my-4">Anime Terpopuler <i class="bi bi-chevron-right"></i></h3>
      </a>
      <div id="popular" class="animes row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2"></div>
    </div>
    <footer-section></footer-section>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      const ongoing = await AnimeSource.ongoingAnime();
      const ongoingContainer = document.querySelector('#ongoing');
      ongoing.slice(-5).forEach((ongoingAnime) => {
        ongoingContainer.innerHTML += createOngoingAnimeItemTemplate(ongoingAnime);
      });

      const favorite = await AnimeSource.favoriteAnime();
      const favoriteContainer = document.querySelector('#favorite');
      favorite.slice(-5).forEach((favoriteAnime) => {
        favoriteContainer.innerHTML += createFavoriteAnimeItemTemplate(favoriteAnime);
      });

      const popular = await AnimeSource.popularAnime();
      const popularContainer = document.querySelector('#popular');
      popular.slice(-5).forEach((popularAnime) => {
        popularContainer.innerHTML += createPopularAnimeItemTemplate(popularAnime);
      });
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Top;
