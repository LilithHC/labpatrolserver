import {TableSchema, DataStore} from "./DataStore"
import {DBType, LabPatroAny} from "./LabPatrolPub"

export interface MonthDict {
    [attr: string]: number
}


export class LabDataFetch {
    dbName:string='labpatrol.db'
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
                                        'examodule':"",
                                        "axoslldp":"",
                                        "exalldp":""}
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
            case DBType.DBType_AXOS_LLDP:
                return rowString[0]['axosLldp']
                break;
            case DBType.DBType_EXA_LLDP:
                return rowString[0]['exaLldp']
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
    
    async queryAxosLldp() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_AXOS_LLDP)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }   
    
    async queryExaLldp() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_EXA_LLDP)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }       

    // async queryLatestAxosCard(period:number) {
    //     let rows = await this.dbStore?.queryLatestTbs() as TableSchema[]
    //     let axoscardtbs:string[] =[]
    //     let curtime = new Date().getTime()
    //     for(let i in rows){
    //         let tbName = rows[i]['name']
    //         let tstr = tbName.
    //         let year = tbName.split()
    //         let tbtime = new Date(,,).getTime()
    //         if(rows[i]['name'].indexOf('axoscard')!=-1 && tbtime > curtime - period*60*60*1000)
    //             axoscardtbs.push(tbName)
    //     }
    //     return axoscardtbs;
    // }

}


if (__filename === require.main?.filename) {
    (async () => {

        let labData = new LabDataFetch()
        await labData.openDb('./labpatrol.db')
        // let res = await labData?.queryLatestAxosCard(24) 

        let rows = await labData.dbStore?.queryLatestTbs() as TableSchema[]
        let tbTime = rows[10000]['name'].slice(7)
        let year = +tbTime.slice(0,4)
        let mond:MonthDict = {
            'Jan':1,
            'Feb':2,
            'Mar':3,
            'Apr':4,
            'May':5,
            'Jun':6,
            'Jul':7,
            'Aug':8,
            'Sep':9,
            'Oct':10,
            'Nov':11,
            'Dec':12
        }
        let month = mond[tbTime.slice(4,7)]
        let day = +tbTime.slice(7,9)
        let hour = +tbTime.slice(9,11)
        let mm = +tbTime.slice(11,13)
        let tbDate = new Date(year,month,day,hour,mm,0).getTime()
        console.log(tbTime,year,month,day,hour,mm)
        console.log(tbDate)

        // let curtime = new Date().getTime()
        // console.log(curtime)

    })()    
}
