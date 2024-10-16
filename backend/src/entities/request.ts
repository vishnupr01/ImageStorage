import { JwtPayload } from "./jwt";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}