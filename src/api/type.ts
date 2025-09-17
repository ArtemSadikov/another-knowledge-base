export abstract class Query<Req = void, Res = void> {
  public abstract execute(req: Req): Res
}

export abstract class Command<Req = unknown, Res = unknown> {
  public abstract execute(req: Req): Res
}

