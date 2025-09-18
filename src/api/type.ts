export abstract class Query<Req = unknown, Res = unknown> {
  public abstract execute(req: Req): Res | Promise<Res>
}

export abstract class Command<Req = unknown, Res = unknown> {
  public abstract execute(req: Req): Res | Promise<Res>
}

