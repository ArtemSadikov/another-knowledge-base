import {Postgres} from "../database";
import {UserEntity} from "./entities";
import {User} from "../../../../domain/user";
import {IUserStore} from "../../../../domain/user/type";
import {NotFound} from "../../../../common/errors";

export class UsersStore implements IUserStore {
  constructor(private readonly db: Postgres) {}

  public async create(...users: User[]): Promise<User[]> {
    if (!users.length) {
      return [];
    }

    const values = users.flatMap(user => [user.email.value, user.password]);

    const query = `
      INSERT INTO users(email, password) VALUES
      ${users.map((_, i) => `($${i+1}, $${i+2})`).join(',')}
      RETURNING *
    `;

    const { rows } = await this.db.pg.query<UserEntity>({
      text: query,
      values,
    });

    return rows.map(r => User.from(r.id, r.email));
  }

  public async findByID(id: string): Promise<User> {
    const query = `
      SELECT * FROM users WHERE id = $1
    `;

    const { rows } = await this.db.pg.query<UserEntity>({
      text: query,
      values: [id],
    });

    if (!rows.length) {
      throw new NotFound();
    }

    const result = rows[0];

    return User.from(result.id, result.email);
  }
}
