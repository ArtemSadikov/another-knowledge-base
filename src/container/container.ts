import {HttpServer, UsersRouter} from "../ui/http";
import {Postgres} from "../gateway/storage/postgres";
import {Command, Query} from "../api/type";
import {RegisterUserCommand} from "../api/commands";
import {AuthRouter, RegisterUserHandler} from "../ui/http/auth";
import {Handler} from "../ui/http/type";
import {UsersService} from "../domain/user/users.service";
import {UsersStore} from "../gateway/storage/postgres/stores";

type Dependencies = {
  config: {
    http: {
      port: number;
    },
    postgres: {
      dsn: string;
    }
  }
  stores: Record<string, any>,
  application: { http: HttpServer }
  queries: Record<string, Query>,
  commands: Record<string, Command>,
  handlers: Record<string, Handler>,
  services: Record<string, any>,
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

    const stores = {
      usersStore: new UsersStore(db),
    }

    const services = {
      usersService: new UsersService(stores.usersStore),
    }

    const queries = {};
    const commands = {
      registerUser: new RegisterUserCommand(services.usersService),
    };

    const handlers = {
      registerUser: new RegisterUserHandler(commands.registerUser)
    }

    const application: Pick<Dependencies, 'application'>['application'] = {
      http: new HttpServer(
        new AuthRouter(
          handlers.registerUser,
        ),
        new UsersRouter()
      ),
    };

    this.dependencies = {
      config,
      queries,
      commands,
      application,
      handlers,
      services,
      stores,
      db,
    }
  }

  public async run(): Promise<void> {
    await this.dependencies.db.connect();

    await this.dependencies.application.http.register('/v1');
    await this.dependencies.application.http.listen(this.dependencies.config.http.port)
  }
}
