import AnimeSource from '../../data/anime-source';
import { createPopularAnimeItemTemplate, loading, failedLoad } from '../templates/template-creator';

const Popular = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
      <h1 class="my-4 judul text-center">Anime Terpopuler</h1>
      <div id="popular" class="popular row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2"></div>
    </div>
    <footer-section></footer-section>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      const popular = await AnimeSource.popularAnime();
      const popularContainer = document.querySelector('#popular');
      popular.forEach((popularAnime) => {
        popularContainer.innerHTML += createPopularAnimeItemTemplate(popularAnime);
      });
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Popular;
