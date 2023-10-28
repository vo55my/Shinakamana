import UrlParser from '../../routes/url-parser';
import AnimeSource from '../../data/anime-source';
import { createCategoryAnimeItemTemplate, loading, failedLoad } from '../templates/template-creator';

const Category = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
      <div id="category" class="category row row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2 g-2 my-5">
    </div>
    <footer-section></footer-section>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      const categories = await AnimeSource.categoryGenre(url.id);
      const categoryContainer = document.querySelector('#category');
      categories.forEach((category) => {
        categoryContainer.innerHTML += createCategoryAnimeItemTemplate(category);
      });
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Category;
