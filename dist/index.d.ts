import { Database, RunResult } from 'sqlite3';
export declare class SqliteExError extends Error {
    sql: string;
    params: any;
    innerError: Error;
    constructor(message: string, innerError: Error, sql: string, params: any);
}
export declare class SqliteEx {
    db: Database;
    constructor(db: Database);
    run(sql: string, params?: object): Promise<RunResult>;
    query<T>(sql: string, params?: object): Promise<T[]>;
    upsert(table: string, doc: object): Promise<RunResult>;
    insert(table: string, doc: object, upsert?: boolean): Promise<RunResult>;
    update(table: string, doc: object, where: object): Promise<RunResult>;
}
