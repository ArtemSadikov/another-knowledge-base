import {HttpServer, UsersRouter} from "../ui/http";
import {Postgres} from "../gateway/storage/postgres";
import {Command, Query} from "../api/type";
import {RegisterUserCommand} from "../api/commands";
import {AuthRouter, RegisterUserHandler} from "../ui/http/auth";
import {Handler, IMiddleware} from "../ui/http/type";
import {UsersService} from "../domain/user";
import {UsersStore} from "../gateway/storage/postgres/stores";
import {BcryptPasswordHasherService} from "../common/password/bcrypt-hasher.service";
import {AuthorizationService} from "../domain/auth";
import {JwtTokenService} from "../common/token/jwt-token.service";
import {AuthorizeCommand} from "../api/commands/authorize.command";
import {AuthGuard} from "../ui/http/middlewares";

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
  middlewares: Record<string, IMiddleware>,
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
      usersService: new UsersService(
        stores.usersStore,
        new BcryptPasswordHasherService()
      ),
      authorizationService: new AuthorizationService(
        new JwtTokenService('super_jwt_secret')
      )
    }

    const queries = {};
    const commands = {
      registerUser: new RegisterUserCommand(
        services.usersService,
        services.authorizationService,
      ),
      authorize: new AuthorizeCommand(
        services.authorizationService,
        services.usersService,
      )
    };

    const middlewares = {
      auth: new AuthGuard(commands.authorize),
    }

    const handlers = {
      registerUser: new RegisterUserHandler(commands.registerUser)
    }

    const application: Pick<Dependencies, 'application'>['application'] = {
      http: new HttpServer(
        new AuthRouter(
          handlers.registerUser,
        ),
        new UsersRouter(
          middlewares.auth,
        )
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
      middlewares,
      db,
    }
  }

  public async run(): Promise<void> {
    await this.dependencies.db.connect();

    await this.dependencies.application.http.register('/v1');
    await this.dependencies.application.http.listen(this.dependencies.config.http.port)
  }
}
