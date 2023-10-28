import AnimeSource from '../../data/anime-source';
import { createSeasonAnimeItemTemplate, loading, failedLoad } from '../templates/template-creator';

const Season = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
      <h1 class="my-4 judul text-center">Musim Anime</h1>
      <div id="season" class="season row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2">
    </div>
    <footer-section></footer-section>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      const seasons = await AnimeSource.seasonAnime();
      const seasonContainer = document.querySelector('#season');
      seasons.forEach((season) => {
        seasonContainer.innerHTML += createSeasonAnimeItemTemplate(season);
      });
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Season;
