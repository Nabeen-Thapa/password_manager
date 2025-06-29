import "reflect-metadata";

export const ROUTE_KEY = Symbol("routePwd123");

import { Request, Response, NextFunction } from 'express';

interface routeDefinition {
    method: string;
    path: string;
    handlerName: string;
    middleware?: ((req: Request, res: Response, next: NextFunction) => void | Promise<void>)[];
}

export function Route(
    method: string, 
    path: string, 
    middleware?: ((req: Request, res: Response, next: NextFunction) => void | Promise<void>)[]
) {
    return function(target: any, propertyKey: string) {
        const existingRoutes: routeDefinition[] = 
            Reflect.getMetadata(ROUTE_KEY, target.constructor) || [];
        
        existingRoutes.push({
            method,
            path,
            handlerName: propertyKey,
            middleware: middleware || []
        });
        
        Reflect.defineMetadata(ROUTE_KEY, existingRoutes, target.constructor);
    };
}