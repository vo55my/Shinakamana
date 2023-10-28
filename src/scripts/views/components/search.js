class Search extends HTMLElement {
  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set clickEvent(event) {
    this._clickEvent = event;
    this.render();
  }

  get value() {
    return this.shadowDOM.querySelector('#search-input').value;
  }

  render() {
    this.shadowDOM.innerHTML = `
    <form action="#/search" class="d-flex mt-3 mt-lg-0" role="search">
      <input class="cari form-control me-2 border-0" type="search" placeholder="Search" id="search-input">
      <button class="btn-cari btn" type="submit" id="search-button"><i class="bi bi-search"></i></button>
    </form>
    `;

    this.shadowDOM
      .querySelector('#search-button')
      .addEventListener('click', this._clickEvent);
  }
}

customElements.define('search-section', Search);
