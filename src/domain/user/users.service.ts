import {User} from "./models";
import {IUserStore} from "./type";

export class UsersService {
  constructor(private readonly usersStore: IUserStore) {}

  public async createUser(email: string, password: string): Promise<User> {
    const user = User.new(email);

    user.setPassword(password);

    if (!user.password) {
      throw new Error("Password is required");
    }

    const [res] = await this.usersStore.create(user);

    return res;
  }
}
