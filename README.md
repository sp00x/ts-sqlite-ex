# ts-sqlite-ex

sqlite3 convenience methods/wrapper

## Known issues

* Documentation = WIP
* No delete() method
* No conditionals parameter for upsert() 

# Usage

``` 
import { Database } from 'sqlite3';
import { SqliteEx } from '@sp00x/sqlite-ex';

let db = new SqliteEx(new Database("file.db"));

db.<method>(..)
db.db.<sqlite3-method>(..)
```

## Properties

### db

Whatever was passed into the constructor

## Methods

### Low-level

#### query()

`query<T>(sql: string, params: any = {}): Promise<T>`

#### run()

`run(sql: string, params: any = {}: Promise<Sqlite3.RunResult>`

### Insert/update

#### insert()

`insert(table: string, doc: any, upsert: boolean = false): Promise<Sqlite3.RunResult`

Insert an object into a table row, optionally doing an upsert (INSERT OR REPLACE INTO).

Example:
```obj.insert('things', { foo: 1, bar: "two" })```

Expects the table 'things' to have fields "foo" and "bar".

#### update()

`update(table: string, doc: any, where: object): Promise<Sqlite3.RunResult>`

Update a table row.

#### upsert()

`upsert(table: string, doc: object): Promise<Sqlite3.RunResult>`

Just a short-form for `insert(.., .., true)` 
