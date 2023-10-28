class Footer extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <footer class="py-4">
      <a href="/" class="text-decoration-none">
        <p class="text-center navbar-brand pt-5">Shinakamana</p>
      </a>
      <ul class="nav justify-content-center">
        <li class="nav-item"><a href="#/top-anime" class="nav-link px-2" id="item">Top Anime</a></li>
        <li class="nav-item"><a href="#/season" class="nav-link px-2" id="item">Musim Anime</a></li>
        <li class="nav-item"><a href="#/genre" class="nav-link px-2" id="item">Genre Anime</a></li>
        <li class="nav-item"><a href="#/about" class="nav-link px-2" id="item">About Us</a></li>
      </ul>
    </footer>
    `;
  }
}

customElements.define('footer-section', Footer);
