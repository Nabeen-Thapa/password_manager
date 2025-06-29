
import { TokenPayload } from "./user.types";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<TokenPayload, "id" | "email">;
    }
  }
}

export {};
