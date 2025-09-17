import {HttpServer, UsersRouter} from "../ui/http";
import {Postgres} from "../gateway/storage/postgres";
import {ListUsersHandler} from "../ui/http/users/list-users.handler";

type Dependencies = {
  config: {
    http: {
      port: number;
    },
    postgres: {
      dsn: string;
    }
  }
  application: { http: HttpServer }
  queries: {},
  commands: {},
  db: Postgres;
}

export class Container {
  private readonly dependencies: Dependencies;

  constructor() {
    const config: Pick<Dependencies, 'config'>['config'] = {
      http: {
        port: 3000,
      },
      postgres: {
        dsn: 'postgresql://postgres:password@127.0.0.1:5432/postgres',
      }
    };

    const db: Pick<Dependencies, 'db'>['db'] = new Postgres(config.postgres);

    const queries: Pick<Dependencies, 'queries'>['queries'] = {};
    const commands: Pick<Dependencies, 'commands'>['commands'] = {};

    const application: Pick<Dependencies, 'application'>['application'] = {
      http: new HttpServer(
        new UsersRouter(
          new ListUsersHandler()
        )
      ),
    };

    this.dependencies = {
      config,
      queries,
      commands,
      application,
      db,
    }
  }

  public async run(): Promise<void> {
    await this.dependencies.db.connect();

    await this.dependencies.application.http.register('/v1');
    await this.dependencies.application.http.listen(this.dependencies.config.http.port)
  }
}
