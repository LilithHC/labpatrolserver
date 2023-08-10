import * as sqlite3 from 'sqlite3'
import logger from "./logger"

export interface TableSchema {
    [attr: string]: string;
}

export class DataStore {
    db: sqlite3.Database | undefined;
    constructor() {

    }

    createDb(dbName: string):Promise<number> {
        return new Promise((resovle)=>{
            this.db = new sqlite3.Database(dbName, (err)=>{
                if (err) {
                    logger.error('create DB' + err)
                }else {
                    logger.info('DB create success')
                }
                resovle(0)
            });

        })
    }

    async createDbTable(tableName: string, tableSchema: TableSchema) {
        let dbDefineStr = 'CREATE TABLE ' + 'IF NOT EXISTS ' + tableName + ' ('
        for (let key in tableSchema) {
            dbDefineStr += '[' + key + ']'+ ' ' + 'TEXT,'
        }
        dbDefineStr = dbDefineStr.slice(0, dbDefineStr.length - 1)
        dbDefineStr += ')'
        logger.info(dbDefineStr)
        return new Promise((resovle)=>{
            if (this.db) {
                this.db.run(dbDefineStr, (error) => {
                    if (error) {
                        logger.error('create table' + error)
                        resovle(-1)
                    }else {
                        logger.info('createDbTable success')
                        resovle(0)
                    }
                    
                })
            }

        })

    }

    async addTableColumn(tableName:string,  columnName:string) {
        let dbDefineStr = `ALTER TABLE ${tableName} ADD COLUMN ${columnName}`
        return new Promise((resovle)=>{
            if (this.db) {
                this.db.run(dbDefineStr, (error) => {
                    if (error) {
                        logger.error('add column' + error)
                        resovle(-1)
                    }else {
                        logger.info('add column success')
                        resovle(0)
                    }
                })
            }
        })           
    }

    async dropTableColumn(tableName:string,  columnName:string) {
      let dbDefineStr = `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`
        return new Promise((resovle)=>{
            if (this.db) {
                this.db.run(dbDefineStr, (error) => {
                    if (error) {
                        logger.error('drop column' + error)
                        resovle(-1)
                    }else {
                        logger.info('drop column success')
                        resovle(0)
                    }
                })
            }
        })           
    }


    async insertData(tableName: string, tableData: TableSchema) {

        let sqlStr = `INSERT INTO ${tableName} VALUES (`;
        let values: string[] = []
        for (let key in tableData) {
            sqlStr += '?,'
            values.push(tableData[key])
        }
        sqlStr = sqlStr.slice(0, sqlStr.length - 1)
        sqlStr += ')'
        logger.info(sqlStr)
        return new Promise((resolve)=>{
            this.db?.run(sqlStr, values, (error) => {
                if (error) {
                    logger.error('insert data' + error)
                }else {
                    logger.info('insert data success')
    
                }
                resolve(0)
            })

        })

    }


    async queryAll(tableName: string) {
        let sql = `SELECT * FROM ${tableName}`
        return new Promise((resolve)=>{
            this.db?.all(sql, [], (err, rows) => {
                if (err) {
                   logger.error('queryAll ' + err)
                }
                logger.info(rows)
                resolve(rows)
            });
        })
    }


    async deleteAllWithCond(tableName: string, tableData:TableSchema) {
        let sql = `DELETE from ${tableName} WHERE `
        let values:string[] = []
        for (let key in tableData) {
            sql += '[' + key + ']' + '=? and '
            values.push(tableData[key])
        } 
        let lastIdx = sql.lastIndexOf('and ')
        sql = sql.slice(0, lastIdx)

        logger.info(sql)
        return new Promise((resolve)=>{
            this.db?.all(sql, values, (error)=>{
                if (error) {
                    logger.error('deleteData ' + error)
                }
                resolve(0)
            })

        })

    }

    async updateData(tableName:string, tableData:TableSchema, cond:TableSchema) {
        let sql = `UPDATE ${tableName}  SET `
        let valueList:string[] = []
        for (let key in tableData) {
            sql += '[' + key + ']'+ `=?, `
            valueList.push(tableData[key])
        }
        let lastIdx = sql.lastIndexOf(', ')
        sql = sql.slice(0, lastIdx)

        sql += ' WHERE'
        for (let key in cond) {
            sql += ` ` + `[` + key + `]` +`= ?`
            valueList.push(cond[key])
        }
        logger.info(sql)
        return new Promise((resolve)=>{
            this.db?.run(sql, valueList, (error)=>{
                if (error) {
                    logger.error('updateData ' + error)
                }
                resolve(0)
            })

        })       
        
    }

    async deleteData(tableName:string, tableData:TableSchema) {
        let sql = `DELETE from ${tableName} WHERE `
        let values:string[] = []
        for (let key in tableData) {
            sql += '[' + key + ']' + '=? and '
            values.push(tableData[key])
        } 
        let lastIdx = sql.lastIndexOf('and ')
        sql = sql.slice(0, lastIdx)

        logger.info(sql)
        return new Promise((resolve)=>{
            this.db?.run(sql, values, (error)=>{
                if (error) {
                    logger.error('deleteData ' + error)
                }
                resolve(0)
            })

        })


    }

    async queryLatestTbs() {
        let sql = `SELECT name FROM sqlite_master WHERE TYPE = 'table' `
        return new Promise((resolve)=>{
            this.db?.all(sql, [], (err, rows) => {
                if (err) {
                   logger.error('queryLatestTbs ' + err)
                }
                logger.info(rows)
                resolve(rows)
            });
        })
    }

    async queryField(tbName:string,fieldName:string) {
        let sql = `SELECT * FROM sqlite_master WHERE TYPE = 'table' AND TBL_NAME = '${tbName}' AND SQL LIKE '%${fieldName}%' `
        return new Promise((resolve)=>{
            this.db?.all(sql, [], (err, rows) => {
                if (err) {
                   logger.error('queryfield ' + err)
                }
                logger.info(rows)
                resolve(rows)
            });
        })
    }

}


if (__filename === require.main?.filename) {
    (async () => {
        let dbStore = new DataStore()
        let dbSchema: TableSchema = {
            "id": '',
            'name is a': '',
            "age":"100"
        }
        let data: TableSchema = {
            "id": '123',
            'name is a': 'SA',
            'age':"200"
        }
        let data1: TableSchema = {
            "id": '1234',
            'name is a': 'SAA',
            'age':'150'
        }

        // await dbStore.createDbTable('member', dbSchema)
        // await dbStore.createDbTable('exa1623303815974', dbSchema)
        
        // await dbStore.insertData('member', data)
        // await dbStore.insertData('member', data1)
        // await dbStore.insertData('member', data1)
        
        // await dbStore.queryAll('member')

        // await dbStore.deleteData('member', data1)
        // await dbStore.queryAll('member')
        // await dbStore.insertData('member', data1)
        // await dbStore.queryAll('member')
        let datacond:TableSchema = {
            "id":"1234",
        }
        let dataChg:TableSchema = {
            "id":"1234",
            "name is a":"changed"
        }
        // await dbStore.updateData('member', dataChg, datacond)
        // await dbStore.queryAll('member')

        // await dbStore.createDb('./labpatrol.db')
        // let rows = await dbStore.queryField('tbAvailableDesc','axosCard')
        // dbStore?.addTableColumn('tbAvailableDesc','offaxoscard')
        // rows = await dbStore.queryField('tbAvailableDesc','offaxoscard')
        // await dbStore.deleteAllWithCond('member', data1);
        // await dbStore.queryAll('member')
    })()    
}
