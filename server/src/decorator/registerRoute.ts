import express,{ Router } from 'express';
import { CONTROLLER_KEY } from './controller.decorator';
import { ROUTE_KEY } from './route.decotrator';
type ControllerConstructor = new (...args: any[]) => any;

interface RouteDefinition {
  method: string;
  path: string;
  handlerName: string;
  middleware?: any[];
}

export function registerRoutes(app: express.Application, controllers: ControllerConstructor[]) {
  controllers.forEach(ControllerClass => {
    // Get controller metadata
    const basePath = Reflect.getMetadata(CONTROLLER_KEY, ControllerClass);
    if (!basePath) {
      throw new Error(`No controller path found for ${ControllerClass.name}`);
    }

    const controllerInstance = new ControllerClass();
    const router = Router();

    // Get all route definitions
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTE_KEY, ControllerClass) || [];

    // Register each route
    routes.forEach(route => {
      const { method, path, handlerName, middleware = [] } = route;
      const handler = controllerInstance[handlerName].bind(controllerInstance);
      
      if (typeof (router as any)[method.toLowerCase()] !== 'function') {
        throw new Error(`Invalid HTTP method: ${method}`);
      }

      // Register with Express router
      (router as any)[method.toLowerCase()](path, ...middleware, handler);
    });

    app.use(basePath, router);
  });
}