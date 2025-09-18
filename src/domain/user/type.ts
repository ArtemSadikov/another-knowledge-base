import {User} from "./models";

export interface IUserStore {
  create(...users: User[]): Promise<User[]>;
  findByID(id: string): Promise<User>;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<void>;
}
