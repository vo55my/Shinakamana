import AnimeSource from '../../data/anime-source';
import { createGenreAnimeItemTemplate, loading, failedLoad } from '../templates/template-creator';

const Genre = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
      <h1 class="py-4 judul text-center">Genre Anime</h1>
      <div id="genre" class="genre row">
    </div>
    <footer-section></footer-section>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      const genres = await AnimeSource.genreAnime();
      const genreContainer = document.querySelector('#genre');
      genres.forEach((genre) => {
        genreContainer.innerHTML += createGenreAnimeItemTemplate(genre);
      });
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Genre;
