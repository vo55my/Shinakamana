import UrlParser from '../../routes/url-parser';
import AnimeSource from '../../data/anime-source';
import { createDetailAnimeItemTemplate, loading, failedLoad } from '../templates/template-creator';

const Detail = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div id="detail" class="detail"></div>
    <footer-section></footer-section>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      const detail = await AnimeSource.detailAnime(url.id);
      const detailContainer = document.querySelector('#detail');
      detailContainer.innerHTML = createDetailAnimeItemTemplate(detail);
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Detail;
