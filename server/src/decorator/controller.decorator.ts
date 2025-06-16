import "reflect-metadata";

export const CONTROLLER_KEY = Symbol("passwrd123");

export function Controller(basePath:string){
    return function (target: Function){
        Reflect.defineMetadata(CONTROLLER_KEY, basePath, target);
    }
}