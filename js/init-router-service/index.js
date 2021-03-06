import {routerInstance} from '@aofl/router';
import routesConfig from '@aofl/templating-plugin/routes.config';

const routes = routesConfig.routes;
const otherwise = '/'; // @todo: change to 404 route
const otherwiseExists = routes.some((item) => item.path === otherwise);

routerInstance.after((request, response, next) => {
  if (response.matchedRoute !== null) {
    next(response);
  } else if (otherwiseExists) {
    routerInstance.navigate(otherwise, true, false, true);
  }
});

routerInstance.init(routes);
routerInstance.navigate(location.pathname.replace('/index.html', ''), true, true);

export default routerInstance;
