class Navbar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <nav class="navbar navbar-expand-lg shadow-lg">
      <div class="container-fluid mx-4">
        <a class="navbar-brand" href="/">Shinakamana</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar2">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbar2Label">Menu</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-start flex-grow-1 pe-3">
              <li class="nav-item">
                <a class="nav-link active" id="item" href="#/top-anime">Top Anime</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" id="item" href="#/season">Musim Anime</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" id="item" href="#/genre">Genre Anime</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" id="item" href="#/about">About Us</a>
              </li>
            </ul>
            <search-section></search-section>
          </div>
        </div>
      </div>
    </nav>
    `;
  }
}

customElements.define('navbar-section', Navbar);
