const createFavoriteAnimeItemTemplate = (favoriteAnime) => `
<div class="col">
  <div class="card text-center w-100 shadow-lg border-0" style="width: 18rem;">
  <img src="${favoriteAnime.images.webp.image_url}" class="card-img-top" alt="Anime Cover">
    <div class="card-body">
      <a href="${`/#/detail/${favoriteAnime.mal_id}`}" class="h6 card-title text-decoration-none anime">${favoriteAnime.title}</a>
      <hr>
      <div class="row row-cols-4 row-cols-sm-2 row-cols-md-2 mt-1">
        <div class="fs-6"><i class="bi bi-person-fill"></i><p>${favoriteAnime.members.toString().substring(0, 3)}rb</p></div>
        <div class="fs-6"><i class="bi bi-camera-video-fill"></i><p>${favoriteAnime.popularity}</p></div>
        <div class="fs-6"><i class="bi bi-star-fill"></i><p>${favoriteAnime.score}</p></div>
        <div class="fs-6"><i class="bi bi-collection-fill"></i><p>${favoriteAnime.favorites}</p></div>
      </div>
    </div>
  </div>
</div>
`;

const createPopularAnimeItemTemplate = (popularAnime) => `
<div class="col">
  <div class="card text-center w-100 shadow-lg border-0" style="width: 18rem;">
  <img src="${popularAnime.images.webp.image_url}" class="card-img-top" alt="Anime Cover">
    <div class="card-body">
      <a href="${`/#/detail/${popularAnime.mal_id}`}" class="h6 card-title text-decoration-none anime">${popularAnime.title}</a>
      <hr>
      <div class="row row-cols-4 row-cols-sm-2 row-cols-md-2 mt-1">
        <div class="fs-6"><i class="bi bi-person-fill"></i><p>${popularAnime.members.toString().substring(0, 3)}rb</p></div>
        <div class="fs-6"><i class="bi bi-camera-video-fill"></i><p>${popularAnime.popularity}</p></div>
        <div class="fs-6"><i class="bi bi-star-fill"></i><p>${popularAnime.score}</p></div>
        <div class="fs-6"><i class="bi bi-collection-fill"></i><p>${popularAnime.favorites}</p></div>
      </div>
    </div>
  </div>
</div>
`;

const createOngoingAnimeItemTemplate = (ongoingAnime) => `
<div class="col">
  <div class="card text-center w-100 shadow-lg border-0" style="width: 18rem;">
  <img src="${ongoingAnime.images.webp.image_url}" class="card-img-top" alt="Anime Cover">
    <div class="card-body">
      <a href="${`/#/detail/${ongoingAnime.mal_id}`}" class="h6 card-title text-decoration-none anime">${ongoingAnime.title}</a>
      <hr>
      <div class="row row-cols-4 row-cols-sm-2 row-cols-md-2 mt-1">
        <div class="fs-6"><i class="bi bi-person-fill"></i><p>${ongoingAnime.members.toString().substring(0, 3)}rb</p></div>
        <div class="fs-6"><i class="bi bi-camera-video-fill"></i><p>${ongoingAnime.popularity}</p></div>
        <div class="fs-6"><i class="bi bi-star-fill"></i><p>${ongoingAnime.score}</p></div>
        <div class="fs-6"><i class="bi bi-collection-fill"></i><p>${ongoingAnime.favorites}</p></div>
      </div>
    </div>
  </div>
</div>
`;

const createSeasonAnimeItemTemplate = (seasonAnime) => `
<div class="col">
  <div class="card text-center w-100 shadow-lg border-0" style="width: 18rem;">
  <img src="${seasonAnime.images.webp.image_url}" class="card-img-top" alt="Anime Cover">
    <div class="card-body">
      <a href="${`/#/detail/${seasonAnime.mal_id}`}" class="h6 card-title text-decoration-none anime">${seasonAnime.title}</a>
      <hr>
      <div class="row row-cols-4 row-cols-sm-2 row-cols-md-2 mt-1">
        <div class="fs-6"><i class="bi bi-person-fill"></i><p>${seasonAnime.members.toString().substring(0, 3)}rb</p></div>
        <div class="fs-6"><i class="bi bi-camera-video-fill"></i><p>${seasonAnime.popularity}</p></div>
        <div class="fs-6"><i class="bi bi-star-fill"></i><p>${seasonAnime.score}</p></div>
        <div class="fs-6"><i class="bi bi-collection-fill"></i><p>${seasonAnime.favorites}</p></div>
      </div>
    </div>
  </div>
</div>
`;

const createDetailAnimeItemTemplate = (detailAnime) => `
<div class="container-fluid mt-4">
  <div class="row mx-2 justify-content-center">
    <div class="col-12 col-lg-3 col-md-4 col-sm-12">
      <img src="${detailAnime.images.webp.image_url}" width="250" class="rounded mb-3" id="image" alt="">
      <div class="card border-0" id="mal">
        <a href="${detailAnime.url}" class="text-decoration-none">
          <div class="card-body">
            <div class="row fs-5 info">
              <div class="col-10"><p>MyAnimeList</p></div>
              <div class="col-2"><i class="bi bi-box-arrow-up-right"></i></div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="col-12 col-lg-9 col-md-8 col-sm-12">
      <h1 class="judul">${detailAnime.title}</h1>
      <p class="fs-5 judul">Sinopsis</p>
      <p class="isi">${detailAnime.synopsis}</p>
    </div>
  </div>
  <div class="row mt-3 mx-2 justify-content-center">
    <div class="col-12 col-lg-3 col-md-4 col-sm-12">
      <div>
        <p class="fs-5 judul">Tipe Anime</p>
        <p class="isi">${detailAnime.type}</p>
      </div>
      <div>
        <p class="fs-5 judul">Status</p>
        <p class="isi">${detailAnime.status}</p>
      </div>
      <div>
        <p class="fs-5 judul">Tanggal Tayang</p>
        <p class="isi">${detailAnime.aired.string}</p>
      </div>
      <div>
        <p class="fs-5 judul">Studio</p>
        ${detailAnime.studios.map((studio) => `<p class="isi">${studio.name}</p>`).join('')}
      </div>
      <div>
        <p class="fs-5 judul">Hari Tayang</p>
        <p class="isi"><a href="/" class="text-decoration-none isi-link">${detailAnime.broadcast.day} <i class="bi bi-box-arrow-up-right"></i></a></p>
      </div>
      <div>
        <p class="fs-5 judul">Musim</p>
        <p class="isi"><a href="#/season" class="text-decoration-none isi-link">${detailAnime.season.toUpperCase()} <i class="bi bi-box-arrow-up-right"></i></a></p>
      </div>
      <div>
        <p class="fs-5 judul">Genre</p>
        ${detailAnime.genres.map((genre) => `<p class="isi"><a href="${`/#/category/${genre.mal_id}`}" class="text-decoration-none isi-link">${genre.name} <i class="bi bi-box-arrow-up-right"></i></a></p>`).join('')}
      </div>
    </div>
    <div class="col-12 col-lg-9 col-md-8 col-sm-12">
      <p class="fs-5 judul">Tersedia di</p>
      <div class="row row-cols-1 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 g-2">
        ${detailAnime.streaming.map((stream) => `
        <div class="col">  
          <div class="card border-0">
            <a href="${stream.url}" class="text-decoration-none" target="_blank">
            <div class="card-body">
              <div class="row info align-items-center">
                <div class="col-10">${stream.name}</div>
                  <div class="col-2">
                    <i class="bi bi-box-arrow-up-right"></i>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>`).join('')} 
      </div>
      <p class="fs-5 mt-4 judul">Tema Lagu</p>
      <div class="row">
        <div class="col-lg-6 col-sm-12 isi">
          <p>Opening</p>
          <p>${detailAnime.theme.openings.join('\n')}</p>
        </div>
        <div class="col-lg-6 col-sm-12 isi">
          <p>Ending</p>
          <p>${detailAnime.theme.endings.join('\n')}</p>
        </div>
      </div>
    </div>
  </div>
</div>
`;

const createGenreAnimeItemTemplate = (genreAnime) => `
<div class="col-lg-4 col-md-6 col-sm-6 my-3">
  <a href="${`/#/category/${genreAnime.mal_id}`}" class="text-decoration-none">
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-10">${genreAnime.name}</div>
        <div class="col-2"><i class="bi bi-chevron-right"></i></div>
      </div>
    </div>
  </div>
</a>
</div>
`;

const createCategoryAnimeItemTemplate = (categoryGenre) => `
<div class="col">
  <div class="card text-center w-100 shadow-lg border-0" style="width: 18rem;">
  <img src="${categoryGenre.images.jpg.image_url}" class="card-img-top" alt="Anime Cover">
    <div class="card-body">
      <a href="${`/#/detail/${categoryGenre.mal_id}`}" class="h6 card-title text-decoration-none anime">${categoryGenre.title}</a>
      <hr>
      <div class="row row-cols-4 row-cols-sm-2 row-cols-md-2 mt-1">
        <div class="fs-6"><i class="bi bi-person-fill"></i><p>${categoryGenre.members}</p></div>
        <div class="fs-6"><i class="bi bi-camera-video-fill"></i><p>${categoryGenre.popularity}</p></div>
        <div class="fs-6"><i class="bi bi-star-fill"></i><p>${categoryGenre.score}</p></div>
        <div class="fs-6"><i class="bi bi-collection-fill"></i><p>${categoryGenre.favorites}</p></div>
      </div>
    </div>
  </div>
</div>
`;

const createResultAnimeItemTemplate = (resultAnime) => `
<div class="col">
  <div class="card text-center w-100 shadow-lg border-0" style="width: 18rem;">
  <img src="${resultAnime.images.jpg.image_url}" class="card-img-top" alt="Anime Cover">
    <div class="card-body">
      <a href="${`/#/detail/${resultAnime.mal_id}`}" class="h6 card-title text-decoration-none anime">${resultAnime.title}</a>
      <hr>
      <div class="row row-cols-4 row-cols-sm-2 row-cols-md-2 mt-1">
        <div class="fs-6"><i class="bi bi-person-fill"></i><p>${resultAnime.members.toString().substring(0, 3)}rb</p></div>
        <div class="fs-6"><i class="bi bi-camera-video-fill"></i><p>${resultAnime.popularity}</p></div>
        <div class="fs-6"><i class="bi bi-star-fill"></i><p>${resultAnime.score}</p></div>
        <div class="fs-6"><i class="bi bi-collection-fill"></i><p>${resultAnime.favorites}</p></div>
      </div>
    </div>
  </div>
</div>
`;

const loading = () => `
<div class="load">
  <div class="honeycomb">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
`;

const failedLoad = () => `
  <div class="load">
    <div class="row row-cols-12 text-center">
      <p class="display-3"><i class="bi bi-question-diamond-fill"></i></p>
      <h4 class="failed">Failed To Load Data</h4>
    </div>
  </div>
`;

export {
  createSeasonAnimeItemTemplate,
  createFavoriteAnimeItemTemplate,
  createPopularAnimeItemTemplate,
  createOngoingAnimeItemTemplate,
  createGenreAnimeItemTemplate,
  createCategoryAnimeItemTemplate,
  createDetailAnimeItemTemplate,
  createResultAnimeItemTemplate,
  loading,
  failedLoad,
};
