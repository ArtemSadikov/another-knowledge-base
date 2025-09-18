import {User} from "./models";
import {IPasswordHasher, IUserStore} from "./type";

export class UsersService {
  constructor(
    private readonly usersStore: IUserStore,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async createUser(email: string, password: string): Promise<User> {
    const user = User.new(email);

    if (!password) {
      throw new Error("Password is required");
    }

    const hash = await this.passwordHasher.hash(password);
    user.setPassword(hash);

    const [res] = await this.usersStore.create(user);

    return res;
  }
}
