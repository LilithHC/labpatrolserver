import {TableSchema, DataStore} from "./DataStore"
import {DBType} from "./LabPatrolPub"

export class LabDataFetch {
    dbName:string=''
    dbStore:DataStore|undefined
    currAxosCardTbName = ''
    currAxosOntTbName =''
    currExaCardTbName =''
    currExaOntTbName =''
    availableDescTableName = 'tbAvailableDesc'
    constructor() {
        this.dbStore = new DataStore()

    }

    async openDb(dbName:string) {
        this.dbName = dbName
        await this.dbStore?.createDb(dbName)

    }

    async getCurrentDbName(dbType:number):Promise<string>{
        let tableItem:TableSchema = {'id':"1",
                                        'axosCard':"",
                                         'axosOnt':"", 
                                         'exaCard':"",
                                        'exaOnt':"",
                                        'axosmodule':"",
                                        'examodule':""}
        let rows = await this.dbStore?.queryAll(this.availableDescTableName)      
        if (!rows || (rows as []).length == 0) {
            return ''
        }

        let rowString = rows as TableSchema[]
        
        switch (dbType) {
            case DBType.DBType_AXOS_CARD:
                return rowString[0]['axosCard']
                break;
            case DBType.DBType_AXOS_ONT:
                return rowString[0]['axosOnt']
                break;
            case DBType.DBType_EXA_CARD:
                return rowString[0]['exaCard']
                break;
            case DBType.DBType_EXA_ONT:
                return rowString[0]['exaOnt']
                break;
            case DBType.DBType_AXOS_MODULE:
                return rowString[0]['axosModule']
                break;
            case DBType.DBType_EXA_MODULE:
                return rowString[0]['exaModule']
                break;
            default:
                break;
        }
        return ''

    }

    async queryExaCard() {
        let exaCard:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_EXA_CARD)
        if (tableName === '') {
            return exaCard
        }

        exaCard = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaCard;
    }

    async queryAxosCard() {
        let axosCard:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_AXOS_CARD)
        if (tableName === '') {
            return axosCard
        }
        axosCard = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return axosCard;
    }    

    async queryAxosOnt() {
        let axosOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_AXOS_ONT)
        if (tableName === '') {
            return axosOnt
        }
        axosOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return axosOnt;
    }      
    
    async queryExaOnt() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_EXA_ONT)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }       
    
    async queryExaModule() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_EXA_MODULE)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }    
    
    async queryAxosModule() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_AXOS_MODULE)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }        
}