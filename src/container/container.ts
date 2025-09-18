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
import {RemoveUserHandler} from "../ui/http/users/remove-user.handler";
import {RemoveUserCommand} from "../api/commands/remove-user.command";
import {UpdateUserCommand} from "../api/commands/update-user.command";
import {UpdateUserHandler} from "../ui/http/users/update-user.handler";
import {ArticlesStore} from "../gateway/storage/postgres/stores/articles.store";
import {ArticleService} from "../domain/article";
import {CreateArticleCommand} from "../api/commands/create-article.command";
import {ListOwnerArticlesQuery, ListArticlesQuery} from "../api/queries";
import {PublishArticleCommand} from "../api/commands/publish-article.command";
import {UnpublishArticleCommand} from "../api/commands/unpublish-article.command";
import {GetArticleByIdQuery} from "../api/queries/get-article-by-id.query";
import {UpdateArticleCommand} from "../api/commands/update-article.command";
import {RemoveArticleCommand} from "../api/commands/remove-article.command";

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

  private static _config: any;

  static get config(): any {
    return this._config;
  }

  constructor() {
    const config: Pick<Dependencies, 'config'>['config'] = {
      http: {
        port: 3000,
      },
      postgres: {
        dsn: 'postgresql://postgres:password@127.0.0.1:5432/postgres',
      }
    };

    Container._config = config;

    const db: Pick<Dependencies, 'db'>['db'] = new Postgres(config.postgres);

    const stores = {
      usersStore: new UsersStore(db),
      articlesStore: new ArticlesStore(db),
    }

    const services = {
      usersService: new UsersService(
        stores.usersStore,
        new BcryptPasswordHasherService()
      ),
      authorizationService: new AuthorizationService(
        new JwtTokenService('super_jwt_secret')
      ),
      articlesService: new ArticleService(
        stores.articlesStore,
      )
    }

    const queries = {
      listOwnerArticles: new ListOwnerArticlesQuery(
        services.articlesService,
      ),
      listArticles: new ListArticlesQuery(
        services.articlesService,
      ),
      getArticleByID: new GetArticleByIdQuery(
        services.articlesService,
      )
    };

    const commands = {
      registerUser: new RegisterUserCommand(
        services.usersService,
        services.authorizationService,
      ),
      authorize: new AuthorizeCommand(
        services.authorizationService,
        services.usersService,
      ),
      removeUser: new RemoveUserCommand(
        services.usersService,
      ),
      updateUser: new UpdateUserCommand(
        services.usersService,
      ),
      createArticle: new CreateArticleCommand(
        services.articlesService,
      ),
      publishArticle: new PublishArticleCommand(
        services.articlesService,
      ),
      unpublishArticle: new UnpublishArticleCommand(
        services.articlesService,
      ),
      updateArticle: new UpdateArticleCommand(
        services.articlesService,
      ),
      removeArticle: new RemoveArticleCommand(
        services.articlesService,
      )
    };

    const middlewares = {
      auth: new AuthGuard(commands.authorize),
    }

    const handlers = {
      registerUser: new RegisterUserHandler(commands.registerUser),
      removeUser: new RemoveUserHandler(commands.removeUser),
      updateUser: new UpdateUserHandler(commands.updateUser),
    }

    const application: Pick<Dependencies, 'application'>['application'] = {
      http: new HttpServer(
        new AuthRouter(
          handlers.registerUser,
        ),
        new UsersRouter(
          middlewares.auth,
          handlers.removeUser,
          handlers.updateUser
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
