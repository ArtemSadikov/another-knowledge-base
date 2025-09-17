import type {PostgresConfig} from "./type";
import PG from 'pg';

export class Postgres {
  private readonly _pg: PG.Pool;

  private pingTimer: NodeJS.Timeout | null = null;

  constructor(private readonly config: PostgresConfig) {
    this._pg = new PG.Pool({
      connectionString: this.config.dsn,
    })
  }

  public async connect(): Promise<void> {
    try {
      await this._pg.connect();

      await this.ping();

      this.pingTimer = setInterval(this.ping.bind(this), 2500);
    } catch (error) {
      console.log(error);

      if (this.pingTimer) {
        clearTimeout(this.pingTimer);
      }

      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this._pg.end();
    } catch (error) {
      console.log(error);

      if (this.pingTimer) {
        clearTimeout(this.pingTimer);
      }

      throw error;
    }
  }

  private async ping(): Promise<void> {
    try {
      await this._pg.query('SELECT 1');
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  public get pg(): PG.Pool {
    return this._pg;
  }
}
