import { loading, failedLoad } from '../templates/template-creator';

const Home = {
  async render() {
    return `
    <div class="loading"></div>
    <div class="container text-center my-5 py-4" id="merah">
        <div class="row justify-content-center">
          <p class="display-1" id="logo">Welcome to</p>
          <p class="display-2 name" id="logo">Shinakamana</p>
          <div class="row">
            <div class="col-lg-12">
              <a class="btn btn-lg hero shadow-lg mt-4" href="#/top-anime" style="width: 15rem;">Top Anime <i class="bi bi-chevron-right"></i></a>
            </div>
            <div class="col-lg-12">
              <a class="btn btn-lg hero shadow-lg mt-4" href="#/season" style="width: 15rem;">Musim Anime <i class="bi bi-chevron-right"></i></a>
            </div>
            <div class="col-lg-12">
              <a class="btn btn-lg hero shadow-lg mt-4" href="#/genre" style="width: 15rem;">Genre Anime <i class="bi bi-chevron-right"></i></a>
            </div>
            <div class="col-lg-12">
              <a class="btn btn-lg hero shadow-lg mt-4" href="#/about" style="width: 15rem;">About Us <i class="bi bi-chevron-right"></i></a>
            </div>
          </div>
        </div>
    </div>
    `;
  },

  async afterRender() {
    const load = document.querySelector('.loading');
    try {
      load.innerHTML = loading();
      load.style.display = 'none';
    } catch (error) {
      load.innerHTML = failedLoad();
    }
  },
};

export default Home;
