import 'regenerator-runtime';
import '../styles/style.css';
import '../styles/loading.css';
import Main from './views/main';

const main = new Main({
  content: document.querySelector('#mainContent'),
});

window.addEventListener('hashchange', () => {
  main.renderPage();
});

window.addEventListener('load', () => {
  main.renderPage();
});
