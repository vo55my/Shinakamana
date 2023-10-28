class Pagination extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <nav class="mt-5">
      <ul class="pagination justify-content-center">
        <li class="page-item"><a class="page-link border-0" href="#" id="page"><i class="bi bi-caret-left-fill"></i></a></li>
        <div id="paginations" class="paginations">
        <li class="page-item"><a class="page-link border-0" href="#" id="page"><i class="bi bi-caret-right-fill"></i></a></li>
      </ul>
    </nav>
    `;
  }
}

customElements.define('pagination-section', Pagination);
