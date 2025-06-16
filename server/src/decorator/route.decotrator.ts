import "reflect-metadata";

export const ROUTE_KEY = Symbol("routePwd123");

interface routeDefinition {
    method: string;
    path: string;
    handlerName: string;
    middleware?: [];
}

export function Route(method: string, path: string, middleware?: []) {
    return function (target: any, propertyKey: string) {
        const existingRoutes: routeDefinition[] = Reflect.getMetadata(ROUTE_KEY, target.constructor) || [];

        existingRoutes.push({
            method,
            path,
            handlerName: propertyKey,
            middleware: middleware || []
        });
        Reflect.defineMetadata(ROUTE_KEY, existingRoutes, target.constructor);
    }
}