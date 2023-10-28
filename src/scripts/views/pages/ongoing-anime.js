import AnimeSource from '../../data/anime-source';
import { createOngoingAnimeItemTemplate, loading, failedLoad } from '../templates/template-creator';

const Ongoing = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
      <h1 class="my-4 judul text-center">Anime Sedang Tayang</h1>
      <div id="ongoing" class="row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2 ongoing"></div>
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
      ongoing.forEach((ongoingAnime) => {
        ongoingContainer.innerHTML += createOngoingAnimeItemTemplate(ongoingAnime);
      });
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Ongoing;
