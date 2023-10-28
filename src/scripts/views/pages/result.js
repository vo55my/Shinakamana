import UrlParser from '../../routes/url-parser';
import AnimeSource from '../../data/anime-source';
import { createResultAnimeItemTemplate, loading, failedLoad } from '../templates/template-creator';

const Result = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
      <div id="result" class="result row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2 my-5">
    </div>
    <footer-section></footer-section>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      const results = await AnimeSource.searchAnime(url.keyword);
      const resultContainer = document.querySelector('#search');
      results.forEach((result) => {
        resultContainer.innerHTML += createResultAnimeItemTemplate(result);
      });
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Result;
