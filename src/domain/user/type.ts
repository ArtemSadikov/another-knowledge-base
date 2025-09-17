import {User} from "./models";

export interface IUserStore {
  create(...users: User[]): Promise<User[]>;
}
