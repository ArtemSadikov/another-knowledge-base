import {HttpServer} from "../ui/http";

type Dependencies = {
  config: { port: number }
  application: HttpServer
  queries: {},
  commands: {},
}

export class Container {
  private readonly dependencies: Dependencies;

  constructor() {
    this.dependencies = {
      config: { port: 3000 },
      application: new HttpServer(),
      queries: {},
      commands: {},
    }
  }

  public async run(): Promise<void> {
    await this.dependencies.application.listen(this.dependencies.config.port)
  }
}
