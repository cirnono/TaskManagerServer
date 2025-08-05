import { ITodo } from "./src/models/Todo";
import type { IUser } from "./src/models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            todo?: ITodo;
        }
    }
}

export {};
