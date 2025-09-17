import {HttpServer} from "../ui/http";
import {Postgres} from "../gateway/storage/postgres";

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

    this.dependencies = {
      config,
      application: {
        http: new HttpServer(),
      },
      queries: {},
      commands: {},
      db: new Postgres(config.postgres),
    }
  }

  public async run(): Promise<void> {
    await this.dependencies.db.connect();

    await this.dependencies.application.http.listen(this.dependencies.config.http.port)
  }
}
