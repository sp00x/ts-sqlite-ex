import { Database, RunResult } from 'sqlite3';

const WHERE_PARAM_PREFIX: string = 'w_h_e_r_e_'; // well...

export class SqliteExError extends Error
{
    sql: string;
    params: any;
    innerError: Error;

    constructor(message: string, innerError: Error, sql: string, params: any)
    {
        // 'Error' breaks prototype chain here
        super(message); 

        this.sql = sql;
        this.params = params;
        this.innerError = innerError;

        // restore prototype chain   
        const actualProto = new.target.prototype;
    
        if (Object.setPrototypeOf) { Object.setPrototypeOf(this, actualProto); } 
        else { (<any>this).__proto__ = new.target.prototype; } 
    }
}

export class SqliteEx
{
    /**
     * The sqlite3 database instance passed into the constructor
     */
    db: Database;

    /**
     * Initialize a new wrapper
     * 
     * @param db A sqlite3 database object
     */
    constructor(db: Database)
    {
        this.db  = db;
    }
    
    /**
     * Promise wrapper around .run()
     * 
     * @param sql The sql statement
     * @param params Parameter values (remember to $-prefix)
     * @returns {Promise<sqlite3.RunResult>} Run result
     */
    run(sql: string, params: object = {}): Promise<RunResult>
    {
        let $this = this;

        return new Promise<RunResult>((resolve, reject) =>
        {
            this.db.run(sql, params, function(err: Error)
            {
                if (err)
                {
                    let msg = "Error '" + err.message + "' - SQL: " + sql + " -- params = " + JSON.stringify(params);
                    reject(new SqliteExError(msg, err, sql, params));
                }
                else resolve(this);
            })
        })
    }

    /**
     * Promise wrapper around .all()
     * 
     * @param sql The sql statement
     * @param params Parameter values (remember to $-prefix)
     * @returns {Promise<T[]>} Rows
     */
    query<T>(sql: string, params: object = {}): Promise<T[]>
    {
        let $this = this;

        return new Promise<T[]>((resolve, reject) =>
        {
            this.db.all(sql, params, function(err: Error, rows: any[])
            {
                if (err)
                {
                    let msg = "Error '" + err.message + "' - SQL: " + sql + " -- params = " + JSON.stringify(params);
                    reject(new SqliteExError(msg, err, sql, params));
                }
                else resolve(rows);
            })
        })
    }

    /**
     * Upsert a row.
     * 
     * This is just a short form for .insert(.., .., true)
     * 
     * @param table The table name
     * @param doc The values to upsert
     * @returns {Promise<sqlite3.RunResult>} Run result
     */
    async upsert(table: string, doc: object): Promise<RunResult>
    {
        return await this.insert(table, doc, true);
    }

    /**
     * Insert a row into a table, based on the contents of an object
     * 
     * @param table The table name
     * @param doc The values to insert (or update)
     * @param upsert Do an upsert instead of a regular insert (INSERT OR REPLACE INTO..)
     */
    async insert(table: string, doc: object, upsert: boolean = false): Promise<RunResult>
    {
        let params = {};

        let sqlFields: string[] = []
        let sqlParams: string[] = [];
        
        for (let key in doc)
        {
            sqlFields.push(key);
            sqlParams.push('$'+key);
            params['$' + key] = doc[key];
        }

        let sql = "INSERT " + (upsert === true ? "OR REPLACE " : "") + "INTO " + table + "("
            + sqlFields.join(",")
            + ") VALUES("
            + sqlParams.join(",")
            + ");";

        //console.log(sql);
        
        return await this.run(sql, params);
    }

    /**
     * Update a row in a table based on the contents of an object, and some conditions in another object
     * @param table The table name
     * @param doc The values to update
     * @param where The conditional values (row identifiers)
     */
    async update(table: string, doc: object, where: object): Promise<RunResult>
    {
        let params = { }; 
        let sqlSets: string[] = [];
        let whereSets: string[] = [];
            
        for (let key in doc)
        {
            sqlSets.push(key + "=$" + key);
            params['$'+key] = doc[key];
        }
       
        for (let key in where)
        {
            let param = WHERE_PARAM_PREFIX + key;
            params['$'+param] = where[key];
            whereSets.push(key + "=$" + param);
        }

        let sql = "UPDATE " + table + " SET "
            + sqlSets.join(", ")
            + " WHERE "
            + whereSets.join(" AND ")
            + ";";

        // console.log(sql);
        // console.dir(params);

        //console.log(sql);

        return await this.run(sql, params);
    }

}