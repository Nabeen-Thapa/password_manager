import express, { Router } from 'express';
import { RequestHandler } from 'express-serve-static-core';


export interface RouteDefinition {
  method: keyof Pick<ReturnType<typeof Router>, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'>;
  path: string;
  handlerName: string;
  middleware?: RequestHandler[];
}


export interface PasswordData {
  service:string;
  username: string;
  password: string;
  id: string;
}


export interface PasswordEntry {
  id?:string;
  username: string;
  password: string; 
  service?: string;
}

export interface PasswordRequest {
  id:string;
  service: string;
  username?: string;
  password?: string;
  oldPassword?: string;
  newPassword?: string;
}
