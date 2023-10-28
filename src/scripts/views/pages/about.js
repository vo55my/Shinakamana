import { loading, failedLoad } from '../templates/template-creator';

const About = {
  async render() {
    return `
    <div class="loading"></div>
    <navbar-section></navbar-section>
    <div class="container">
    <h1 class="text-center py-4 judul">About Us</h1>
    <div class="row pb-5">
      <div class="col-lg-6 col-md-6 col-sm-12 align-self-center fs-4 px-4" id="deskripsi">
        <div class="card border-0">
          <div class="card-header">
            <div class="text-end" id="item">
              <i class="bi bi-circle-fill" id="merah"></i>
              <i class="bi bi-circle-fill" id="cream"></i>
              <i class="bi bi-circle-fill" id="hitam"></i>
            </div>
          </div>
          <div class="card-body">
            <p>Selamat Datang di Shinakamana!!!</p>
            <p>Website Shinakamana adalah website yang memberikan info platform menonton anime apapun secara legal dengan mudah dan cepat!</p>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 my-5 text-center">
        <img src="about/shinakamana.png" width="300rem" class="mb-3 img-thumbnail border-0 rounded-circle" id="gambar" alt="">
      </div>
    </div>
  </div>
  <footer-section></footer-section>
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

export default About;
