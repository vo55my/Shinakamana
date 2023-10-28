import Home from '../views/pages/home';
import About from '../views/pages/about';
import Season from '../views/pages/season';
import Favorite from '../views/pages/favorite-anime';
import Popular from '../views/pages/popular-anime';
import Ongoing from '../views/pages/ongoing-anime';
import Top from '../views/pages/top-anime';
import Detail from '../views/pages/detail';
import Genre from '../views/pages/genre';
import Category from '../views/pages/category';
import Result from '../views/pages/result';

const routes = {
  '/': Home, // default page
  '/home': Home,
  '/about': About,
  '/season': Season,
  '/top-anime': Top,
  '/favorite-anime': Favorite,
  '/popular-anime': Popular,
  '/ongoing-anime': Ongoing,
  '/genre': Genre,
  '/detail/:id': Detail,
  '/category/:id': Category,
  '/result/:keyword': Result,
};

export default routes;
